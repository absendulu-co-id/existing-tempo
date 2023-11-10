import { ImportTableColumn } from "../store/slices/import";
import * as Sentry from "@sentry/react";
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ColInfo, Properties, WorkSheet } from "xlsx";

class _XlsxService {
  XLSX: typeof import("xlsx") | null = null;
  ExcelJS: typeof import("exceljs") | null = null;

  readonly properties: Properties = {
    Author: "Absendulu.id",
    LastAuthor: "Absendulu.id",
    Keywords: "Absendulu.id",
  };

  async loadExcelJS() {
    if (this.ExcelJS != null) {
      return this.ExcelJS;
    }

    const ExcelJS = await import(/* webpackPrefetch: true */ "exceljs");
    this.ExcelJS = ExcelJS;

    return ExcelJS;
  }

  async loadXlsx() {
    if (this.XLSX != null) {
      return this.XLSX;
    }

    const XLSX = await import(/* webpackPrefetch: true */ "xlsx");
    this.XLSX = XLSX;

    return XLSX;
  }

  async xlsx(
    p: {
      fileName: string;
      autoWidth?: boolean;
      disableFileNameChange?: boolean;
    },
    buildWorkbook: (XLSX: typeof import("xlsx")) => import("xlsx").WorkBook,
  ) {
    const autoWidth = p.autoWidth ?? true;
    const disableFileNameChange = p.disableFileNameChange ?? false;
    let { fileName } = p;

    try {
      const XLSX = await this.loadXlsx();
      const workbook = buildWorkbook(XLSX);

      if (!disableFileNameChange) {
        if (!fileName.startsWith("ab")) {
          fileName = `ab ${fileName}`;
        }

        if (!fileName.endsWith(".xlsx")) {
          fileName = `${fileName} ${moment().format("L LTS")}`;
        } else {
          fileName = fileName.replace(".xlsx", ` ${moment().format("L LTS")}`);
        }
      }

      if (autoWidth) {
        for (const sheet of workbook.SheetNames) {
          await this.autoFitColumns(workbook.Sheets[sheet]);
        }
      }

      XLSX.writeFile(workbook, fileName.replace(".xlsx", "").toSnakeCase() + ".xlsx", {
        compression: true,
        Props: this.properties,
      });
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      throw err;
    }
  }

  async htmlTableToXlsx(
    element: HTMLTableElement,
    p: {
      fileName: string;
      autoWidth?: boolean;
      disableFileNameChange?: boolean;
    },
  ) {
    await this.xlsx(p, (XLSX) => {
      const workbook = XLSX.utils.table_to_book(element, { raw: true, cellDates: false, cellStyles: true });

      return workbook;
    });
  }

  async xlsxToJson(p: {
    file: File;
    documentName: string;
    columns: Record<string, ImportTableColumn>;
    selectedColumns: Record<string, any>;
  }) {
    const { file, documentName, columns, selectedColumns } = p;

    try {
      const XLSX = await this.loadXlsx();

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { UTC: false });
      const worksheet = workbook.Sheets[workbook.SheetNames.find((x) => x == documentName) ?? workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json<string[]>(worksheet, {
        header: 1,
        blankrows: false,
        raw: true,
        rawNumbers: true,
      });

      if (json[0][0].includes("Template")) {
        json.shift();
      }

      const columns: string[] = json[0];

      const newJson: Record<string, any>[] = [];
      json.forEach((row, i) => {
        if (i == 0) return;
        const newRow: Record<string, any> = {};

        row.forEach((cell, j) => {
          newRow[columns[j]] = cell;
        });

        newJson.push(newRow);
      });

      return {
        columns: columns,
        data: newJson,
      };
    } catch (err: any) {
      console.error(err);
      Sentry.captureException(err);
      void Swal.fire({
        title: "Parse Excel Error!",
        html: `Please check your excel file and try again.<br><code style="font-size: 8pt">${err.name}: ${err.message}</code>`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  /** https://github.com/SheetJS/sheetjs/issues/1473#issuecomment-1339690813 */
  async autoFitColumns(worksheet: WorkSheet) {
    const XLSX = await this.loadXlsx();

    const objectMaxLength: ColInfo[] = [];

    const lastRow = XLSX.utils.decode_range(worksheet["!ref"]!).e.r;

    for (const column of this._buildColumnsArray(worksheet)) {
      let maxCellLength = 0;

      for (let row = 1; row <= lastRow + 1; row++) {
        const cell = worksheet[`${column}${row}`];

        if (cell != null) {
          const cellLength = cell.v.length + 1;
          if (cellLength > maxCellLength) maxCellLength = cellLength;
        }
      }

      objectMaxLength.push({ wch: maxCellLength });
    }

    worksheet["!cols"] = objectMaxLength;
  }

  /** https://stackoverflow.com/a/34910965/5989987 */
  private _buildColumnsArray(sheet: WorkSheet) {
    const alphaToNum = (alpha: string) => {
      let num = 0;
      for (let i = 0; i < alpha.length; i++) {
        num = num * 26 + alpha.charCodeAt(i) - 0x40;
      }

      return num - 1;
    };

    const numToAlpha = (num: number) => {
      let alpha = "";

      for (; num >= 0; num = num / 26 - 1) {
        alpha = String.fromCharCode((num % 26) + 0x41) + alpha;
      }

      return alpha;
    };

    const rangeNum = sheet["!ref"]!.split(":").map((val) => alphaToNum(val.replace(/[0-9]/g, "")));
    const res: string[] = [];

    for (let i = rangeNum[0]; i < rangeNum[1] + 1; i++) {
      res.push(numToAlpha(i));
    }

    return res;
  }

  // private async pipeExcelJs(workbook: WorkBook) {
  // const [XLSX, Excel] = await Promise.all([this.loadXlsx(), this.loadExcelJS()]);
  // const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //
  // console.log(buffer);
  // const workbook1 = new Excel.Workbook();
  // await workbook1.xlsx.load(buffer);
  // const data = await workbook1.xlsx.writeBuffer();
  //
  // const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  // const url = window.URL.createObjectURL(blob);
  // const anchor = document.createElement("a");
  // anchor.href = url;
  // anchor.download = "download.xlsx";
  // anchor.click();
  // window.URL.revokeObjectURL(url);
  // }
}

export const XlsxService = new _XlsxService();

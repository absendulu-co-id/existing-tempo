import { MyColumn } from "../components/MyMaterialTable";
import { XlsxService } from "./xlsx.service";
import { dotToObject } from "app/helper/object.helper";
import { ExportType } from "export-from-json";
import { Styles } from "jspdf-autotable";
import moment from "moment";
import { renderToStaticMarkup } from "react-dom/server";
import { IntlProvider } from "react-intl";

class _MaterialTableExportService<RowData extends object = any> {
  async export(columns: MyColumn<RowData>[], data: RowData[] = [], filename = "data", exportType: ExportType) {
    try {
      filename = this.getFileName(filename);

      const exportFromJSON = (await import("export-from-json")).default;

      const finalData = this.transformTransposedData(columns, data);

      exportFromJSON({
        data: finalData,
        fileName: filename,
        exportType: exportType == "html" ? "xls" : exportType, // DIRTY HACK
        extension: exportType, // DIRTY HACK
        withBOM: true,
      });
    } catch (err) {
      console.error(`error in export : ${err}`);
    }
  }

  async xlsx(columns: MyColumn<RowData>[], data: RowData[] = [], filename: string) {
    await XlsxService.xlsx({ fileName: this.getFileName(filename, false) }, (XLSX) => {
      const finalData = this.transformTransposedData(columns, data);

      const worksheet = XLSX.utils.json_to_sheet(finalData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${filename} ${moment().format("L LTS")}`.substring(0, 31).replaceAll("/", "_"),
      );

      return workbook;
    });
  }

  async pdf(columns: MyColumn<RowData>[], data: RowData[] = [], filename: string) {
    try {
      const title = `${filename} ${moment().format("L LTS")}`;
      const JsPDF = (await import(/* webpackPrefetch: true */ "jspdf")).default;
      const autoTable = (await import(/* webpackPrefetch: true */ "jspdf-autotable")).default;

      const finalData = this.transformData(columns, data);

      const doc = new JsPDF({
        compress: true,
        unit: "mm",
        orientation: "landscape",
        format: "a4",
      });

      doc.viewerPreferences(
        {
          HideToolbar: true,
          HideMenubar: true,
          DisplayDocTitle: true,
        },
        true,
      );

      doc.setProperties({
        title,
        author: "Absendulu.id",
        keywords: "Absendulu.id",
        creator: "Absendulu.id",
      });

      doc.setFontSize(15);
      doc.text(title, 10, 10);

      autoTable(doc, {
        startY: 12,
        theme: "grid",
        margin: {
          left: 10,
          right: 10,
        },
        head: [
          columns.map((col) => ({
            title: renderToStaticMarkup(col.title ?? ("" as any)),
            styles: {
              ...this.getCellStyle(col, {} as any, "headerStyle"),
              halign: "center",
              overflow: "linebreak",
            },
          })),
        ],
        body: finalData.map((row, iRow) =>
          row.map((col, i) => ({
            content: col,
            ...(columns[i].cellStyle
              ? {
                  styles: this.getCellStyle(columns[i], data[iRow], "cellStyle"),
                }
              : {}),
          })),
        ),
      });

      doc.save(`${this.getFileName(filename)}.pdf`);
    } catch (err) {
      console.error("exporting pdf", err);
    }
  }

  private transformData(columns: MyColumn<RowData>[], data: RowData[] = []): string[][] {
    let finalData: any = data;

    console.log(columns);

    if (data.length && !Array.isArray(data[0])) {
      if (typeof data[0] === "object") {
        // Turn data into an array of string arrays, without the `tableData` prop
        finalData = data.map((row) => {
          return columns.map((col) => {
            if (col.exportTransformer != null) {
              return col.exportTransformer(row) ?? "";
            }

            if (col.renderXls != null) {
              console.log(row, col.renderXls(row));
              return col.renderXls(row) ?? "";
            }

            if (col.render != null) {
              const normalizedRow = dotToObject(row);
              try {
                return (
                  renderToStaticMarkup(
                    <IntlProvider
                      locale={"id-ID"}
                      defaultFormats={{
                        number: { "id-Id": { currency: "SDF" } },
                      }}
                    >
                      {col.render(normalizedRow, "row") as any}
                    </IntlProvider>,
                  ) ?? ""
                );
              } catch (err) {
                console.warn(col.field, normalizedRow, (err as any).message);
              }
            }
            if (col.field == null) {
              console.warn("No field defined for column : ", col);
              return "";
            } else {
              if (Array.isArray(col.field)) {
                console.warn("Array fields are not supported", col);
                return "";
              }
              return row[col.field as string];
            }
          });
        });
      }
    }

    return finalData;
  }

  private transformTransposedData(columns: MyColumn<RowData>[], data: RowData[] = []) {
    const finalData: string[][] = this.transformData(columns, data);

    const columnsTitle = columns.map((col) => renderToStaticMarkup(col.title ?? ("" as any)));

    return finalData.map((col) => {
      const obj = {};
      col.forEach((row, i) => {
        obj[columnsTitle[i]] = row;
      });

      return obj;
    }) as RowData[];
  }

  private getCellStyle(column: MyColumn<RowData>, row: RowData, propertyName: string): Partial<Styles> {
    let cellStyle = column[propertyName];

    if (typeof cellStyle === "function") {
      const resCellStyle = column[propertyName]({}, row);
      cellStyle = resCellStyle;
    }

    const obj = {
      font: cellStyle?.font,
      fontStyle: cellStyle?.fontStyle as any,
      overflow: cellStyle?.overflow as any,
      fillColor: cellStyle?.backgroundColor ?? (propertyName == "headerStyle" ? "#eeefee" : undefined),
      textColor: cellStyle?.color ?? (propertyName == "headerStyle" ? "#000000" : undefined),
      // halign: ,
      // valign: ,
      fontSize: cellStyle?.fontSize != null ? parseInt(cellStyle?.fontSize?.toString().replace(/\D/g, "")) : undefined,
      // cellPadding: ,
      // lineColor: ,
      // lineWidth: ,
      // cellWidth: ,
      // minCellHeight: ,
      // minCellWidth: ,
    };

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);

    return obj;
  }

  private getFileName(filename: string, withTime: boolean = true) {
    const time = withTime ? `_${moment().format("L LTS")}` : "";
    return `ab_${filename}${time}`.toSnakeCase();
  }
}

export const MaterialTableExportService = new _MaterialTableExportService();

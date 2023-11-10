import { ImportTableColumn } from "../store/slices/import";
import { XlsxService } from "./xlsx.service";

class _ImportService {
  async generateTemplate(p: {
    documentName: string;
    columns: Record<string, ImportTableColumn>;
    selectedColumns: Record<string, any>;
  }) {
    const { documentName, columns, selectedColumns } = p;

    const selected = Object.keys(selectedColumns);

    const json: any[] = [{}];

    Object.keys(columns)
      .filter((x) => selected.includes(x))
      .forEach((key) => {
        json[0][key] = "";
      });

    await XlsxService.xlsx({ fileName: `template_${documentName}` }, (XLSX) => {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(json, {
        origin: "A2",
        UTC: false,
      });

      if (!worksheet.A1) worksheet.A1 = { t: "s", v: `Template ${documentName}` };

      if (!worksheet["!merges"]) worksheet["!merges"] = [];
      worksheet["!merges"].push(XLSX.utils.decode_range("A1:C1"));

      XLSX.utils.book_append_sheet(workbook, worksheet, documentName);
      return workbook;
    });
  }

  async import(p: {
    file: File;
    documentName: string;
    columns: Record<string, ImportTableColumn>;
    selectedColumns: Record<string, any>;
  }) {
    return await XlsxService.xlsxToJson(p);
  }
}

export const ImportService = new _ImportService();

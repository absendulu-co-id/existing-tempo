import * as types from "@mid/components/field/types";
import MeasureTypeComponent from "app/components/MeasureTypeComponent";

const data = [];
data["/master/trainingTypes"] = {
  model: "trainingType",
  endPoint: "trainingType",
  defaultOrder: "trainingTypeName",
  primaryKey: "trainingTypeId",
  // CustomAction: React.lazy(() => import("./custom/test")),
  fields: [
    {
      name: "trainingTypeName",
      label: "Nama Jenis Latihan",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      name: "trainingTypeMinimumUnit",
      label: "Minimal Satuan",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      allowExport: true,
      allowImport: true,
      showOnTable: true,
      required: true,
      value: "1.0",
      validations: "isFloat",
      validationErrors: {
        isFloat: "Field Harus diisi dan hanya boleh berupa angka",
      },
    },
    {
      name: "trainingTypeUnit",
      label: "Satuan",
      fieldType: types.TYPE_FIELD_SELECT,
      dataSource: "CUSTOM", // API or CUSTOM
      endPoint: "", // Requeired IF API
      valueColumn: "", // Requeired IF API
      labelColumn: "", // Requeired IF API
      isAlias: true,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: false,
      value: 3,
      defaultValue: null,
      option: [
        { label: "Menit", value: 1 },
        { label: "Jam", value: 2 },
        { label: "Hari Kerja", value: 3 },
        { label: "HH:MM", value: 4 },
      ],
      render: (rowData) => <MeasureTypeComponent name={rowData.trainingTypeUnit} />,
    },
    {
      name: "trainingTypeRoundOff",
      label: "Pembulatan",
      fieldType: types.TYPE_FIELD_SELECT,
      dataSource: "CUSTOM", // API or CUSTOM
      endPoint: "", // Requeired IF API
      valueColumn: "", // Requeired IF API
      labelColumn: "", // Requeired IF API
      isAlias: true,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: false,
      value: true,
      defaultValue: null,
      option: [
        { label: "Iya", value: true },
        { label: "Tidak", value: false },
      ],
      render: (rowData) => (rowData.trainingTypeRoundOff ? "Iya" : "Tidak"),
    },
    {
      label: "Simbol Laporan",
      name: "trainingTypeReportSymbol",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      allowExport: true,
      allowImport: true,
      showOnTable: true,
      required: true,
    },
  ],
};

export const trainingTypePage = data;

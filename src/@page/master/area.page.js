import * as types from "@mid/components/field/types";

const data = [];
data["/master/areas"] = {
  model: "area",
  endPoint: "area",
  defaultOrder: "areaName",
  primaryKey: "areaId",
  // CustomAction: React.lazy(() => import("./custom/test")),
  fields: [
    {
      name: "superior",
      label: "Area Induk",
      fieldType: types.TYPE_FIELD_AUTOCOMPLETE,
      dataSource: "API", // API or CUSTOM
      endPoint: "area", // Requeired IF API
      valueColumn: "areaId", // Requeired IF API
      labelColumn: "areaName", // Requeired IF API
      isAlias: true,
      allowSearch: false,
      showOnTable: false,
      allowExport: true,
      allowImport: true,
      required: false,
      value: null,
      defaultValue: null,
    },
    {
      name: "areaName",
      label: "Nama Area",
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
      name: "areaCode",
      label: "Kode Area",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      allowExport: true,
      allowImport: true,
      showOnTable: true,
      required: false,
    },
  ],
};

export const areaPage = data;

import * as types from "@mid/components/field/types";

const data = [];
data["/master/positions"] = {
  model: "position",
  endPoint: "Position",
  defaultOrder: "positionName",
  primaryKey: "positionId",
  // CustomAction: React.lazy(() => import("./custom/test")),
  fields: [
    {
      name: "superior",
      label: "Jabatan Induk",
      fieldType: types.TYPE_FIELD_AUTOCOMPLETE,
      dataSource: "API", // API or CUSTOM
      endPoint: "position", // Requeired IF API
      valueColumn: "positionId", // Requeired IF API
      labelColumn: "positionName", // Requeired IF API
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
      name: "positionName",
      label: "Nama Jabatan",
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
      name: "positionCode",
      label: "Kode Jabatan",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      allowExport: true,
      allowImport: true,
      showOnTable: true,
      required: false,
    },
  ],
};

export const positionPage = data;

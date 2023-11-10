import * as types from "@mid/components/field/types";

const data = [];
data["/master/departments"] = {
  model: "department",
  endPoint: "department",
  defaultOrder: "departmentName",
  primaryKey: "departmentId",
  // CustomAction: React.lazy(() => import("./custom/test")),
  fields: [
    {
      name: "superior",
      label: "Departemen Induk",
      fieldType: types.TYPE_FIELD_AUTOCOMPLETE,
      dataSource: "API", // API or CUSTOM
      endPoint: "department", // Requeired IF API
      valueColumn: "departmentId", // Requeired IF API
      labelColumn: "departmentName", // Requeired IF API
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
      name: "departmentName",
      label: "Nama Departemen",
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
      name: "departmentCode",
      label: "Kode Departemen",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      allowExport: true,
      allowImport: true,
      showOnTable: true,
      required: false,
    },
  ],
};

export const departmentPage = data;

import * as types from "@mid/components/field/types";

const data = [];
data["/workflow/workflowRole"] = {
  model: "workflowRole",
  endPoint: "workflowRole",
  defaultOrder: "workflowRoleName",
  primaryKey: "workflowRoleId",
  fields: [
    {
      name: "workflowRoleName",
      label: "Nama Role",
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
      name: "workflowRoleCode",
      label: "Kode Role",
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
      name: "workflowRoleDescription",
      label: "Keterangan",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: false,
      allowExport: true,
      allowImport: true,
      required: false,
    },
  ],
};

export const workflowRolePage = data;

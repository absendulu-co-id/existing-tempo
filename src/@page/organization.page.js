import * as types from "@mid/components/field/types";

const data = [];
data["/users_n_groups/organizations"] = {
  model: "organization",
  endPoint: "organizations",
  defaultOrder: "organizationName",
  primaryKey: "organizationId",
  fields: [
    {
      name: "organizationName",
      label: "Nama organisasi",
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
      name: "organizationCode",
      label: "Kode organisasi",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      allowExport: true,
      allowImport: true,
      showOnTable: true,
      validations: "isAlphanumeric",
      validationErrors: {
        isAlphanumeric: "Field Harus diisi dan hanya boleh berupa huruf dan angka",
      },
      required: true,
    },
    {
      auth: ["admin"],
      name: "expiredAt",
      label: "Tanggal Exp",
      fieldType: types.TYPE_FIELD_DATETIME,
      allowSearch: false,
      allowExport: true,
      allowImport: true,
      showOnTable: false,
      required: true,
    },
    {
      name: "organizationAddress",
      label: "Alamat",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      allowExport: true,
      allowImport: true,
      showOnTable: false,
      required: false,
    },
    {
      name: "organizationPhone",
      label: "Nomor Telepon",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      allowExport: true,
      allowImport: true,
      showOnTable: false,
      required: false,
    },
  ],
};

export const organizationPage = data;

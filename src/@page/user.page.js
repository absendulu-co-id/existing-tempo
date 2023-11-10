import * as types from "@mid/components/field/types";

const data = [];
data["/users_n_groups/users"] = {
  model: "user",
  endPoint: "users",
  customFilterApi: "filter[where][userType][ne]=employee&filter[where][username][ne]=midadmin",
  defaultOrder: "userName",
  primaryKey: "userId",
  fields: [
    {
      name: "username",
      label: "Username",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: "isAlphanumeric",
      validationErrors: {
        isAlphanumeric: "Field Harus diisi dan hanya boleh berupa huruf dan angka",
      },
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      name: "accountName",
      label: "Nama Akun",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      allowExport: true,
      allowImport: true,
      showOnTable: true,
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
      required: true,
    },
    {
      name: "email",
      label: "Email",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      allowExport: true,
      allowImport: true,
      showOnTable: false,
      validations: "isEmail",
      validationErrors: {
        isEmail: "Email tidak valid",
      },
      required: false,
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: { minLength: 6 },
      validationErrors: {
        minLength: "Minimal panjang karakter 6",
      },
      allowSearch: false,
      allowExport: true,
      allowImport: true,
      showOnTable: false,
      required: true,
    },
    {
      type: "password",
      name: "repeat_password",
      label: "Ulangi Password",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: { equalsField: "password" },
      validationErrors: {
        equalsField: "Isi field tidak sama dengan Field Password",
      },
      allowSearch: false,
      allowExport: true,
      allowImport: true,
      showOnTable: false,
      required: true,
    },
  ],
};

export const userPage = data;

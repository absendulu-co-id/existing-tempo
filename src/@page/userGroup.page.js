import * as types from "@mid/components/field/types";

const data = [];
data["/users_n_groups/user_groups"] = {
  model: "userGroup",
  endPoint: "userGroups",
  defaultOrder: "userGroupName",
  primaryKey: "userGroupId",
  fields: [
    {
      name: "userGroupName",
      label: "Kelompok Pengguna",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
  ],
};

export const userGroupPage = data;

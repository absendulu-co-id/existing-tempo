import * as types from "@mid/components/field/types";

const data = [];
data["/shifts/shift"] = {
  model: "shift",
  endPoint: "shift",
  defaultOrder: "shiftName",
  primaryKey: "shiftId",
  fields: [
    {
      label: "Kode Shift",
      name: "shiftId",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Nama Shift",
      name: "shiftName",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Jadwal",
      name: "timeTables",
      fieldType: types.TYPE_FIELD_SELECT_MULTIPLE,
      dataSource: "API", // API or CUSTOM
      endPoint: "timeTables", // Requeired IF API
      valueColumn: "timeTableId", // Requeired IF API
      labelColumn: "timeTableName", // Requeired IF API
      isAlias: true,
      originOptions: true, // option origin from api
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      render: (rowData) => rowData.timeTables?.map((x) => x.timeTableId).join(", "),
    },
    // {
    //   label: "Auto Shift",
    //   name: "isAutoShift",
    //   fieldType: types.TYPE_FIELD_SELECT,
    //   dataSource: "CUSTOM", // API or CUSTOM
    //   endPoint: "", // Requeired IF API
    //   valueColumn: "", // Requeired IF API
    //   labelColumn: "", // Requeired IF API
    //   isAlias: true,
    //   allowSearch: false,
    //   showOnTable: true,
    //   allowExport: true,
    //   allowImport: true,
    //   required: true,
    //   option: [
    //     { label: "Iya", value: true },
    //     { label: "Tidak", value: false },
    //   ],
    //   render: (rowData) => (rowData.isAutoShift ? "Iya" : "Tidak"),
    // },
  ],
};

export const shiftPage = data;

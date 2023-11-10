import * as types from "@mid/components/field/types";

const data = [];
data["/master/employees"] = {
  model: "employee",
  endPoint: "employees",
  defaultOrder: "employeeName",
  primaryKey: "employeeId",
  // CustomAction: React.lazy(() => import("./custom/test")),
  isImportEnabled: true,
  fields: [
    {
      label: "ID Karyawan",
      name: "employeeId",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Nama Karyawan",
      name: "employeeName",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      name: "employeeTypeName",
      label: "Tipe Karyawan",
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
      required: true,
      value: 0,
      defaultValue: "",
      option: [
        { label: "Permanent", value: "Permanent" },
        { label: "Temporary", value: "Temporary" },
      ],
    },
    {
      label: "Departemen",
      name: "departmentName",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Jabatan",
      name: "positionName",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Area",
      name: "areaIdAreas",
      fieldType: types.TYPE_FIELD_SELECT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      render: (row) => row.areaIdAreas?.map((x) => x.areaName).join(", "),
    },
  ],
};

export const employeePage = data;

import * as types from "@mid/components/field/types";

const data = [];
data["/request/leave_request"] = {
  model: "Leaves",
  endPoint: "Leaves",
  defaultOrder: "startDate",
  primaryKey: "leaveId",
  // CustomAction: React.lazy(() => import("./custom/test")),
  fields: [
    {
      name: "createdAt",
      label: "Tanggal Pengajuan",
      fieldType: types.TYPE_FIELD_DATETIME,
      isAlias: true,
      allowInsert: false,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: false,
      value: null,
      defaultValue: null,
    },
    {
      name: "leaveTypeName",
      label: "Jenis Cuti",
      fieldType: types.TYPE_FIELD_AUTOCOMPLETE,
      dataSource: "API", // API or CUSTOM
      endPoint: "leaveType", // Requeired IF API
      valueColumn: "leaveTypeId", // Requeired IF API
      labelColumn: "leaveTypeName", // Requeired IF API
      isAlias: false,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: false,
      value: null,
      defaultValue: null,
    },
    {
      name: "reason",
      label: "Alasan",
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
      name: "startDate",
      label: "Tanggal Mulai",
      fieldType: types.TYPE_FIELD_DATE,
      isAlias: true,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: false,
      value: null,
      defaultValue: null,
    },
    {
      name: "endDate",
      label: "Tanggal Selesai",
      fieldType: types.TYPE_FIELD_DATE,
      isAlias: true,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: false,
      value: null,
      defaultValue: null,
    },
    {
      name: "auditStatus",
      label: "Audit Status",
      fieldType: types.TYPE_FIELD_SELECT,
      dataSource: "CUSTOM", // API or CUSTOM
      endPoint: "", // Requeired IF API
      valueColumn: "", // Requeired IF API
      labelColumn: "", // Requeired IF API
      isAlias: true,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      allowInsert: false,
      required: false,
      value: "",
      defaultValue: "",
      option: [
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" },
      ],
    },
  ],
};

export const requestLeavePage = data;

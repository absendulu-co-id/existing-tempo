import * as types from "@mid/components/field/types";

const data = [];
data["/approval/leave"] = {
  model: "leave",
  endPoint: "leaves",
  defaultOrder: "createdAt",
  sortDirection: "desc",
  primaryKey: "leaveId",
  fields: [
    {
      name: "createdAt",
      label: "Tanggal",
      fieldType: types.TYPE_FIELD_DATETIME,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Nama Karyawan",
      name: "employeeName",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Jenis Cuti",
      name: "leaveTypeName",
      fieldType: types.TYPE_FIELD_SELECT,
      dataSource: "API", // API or CUSTOM
      endPoint: "leaveType", // Requeired IF API
      valueColumn: "leaveTypeId", // Requeired IF API
      labelColumn: "leaveTypeName", // Requeired IF API
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Alasan",
      name: "reason",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Tanggal Mulai",
      name: "startDate",
      fieldType: types.TYPE_FIELD_DATE,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      //   render: (rowData) => moment(rowData.startDate).format("DD-MM-YYYY"),
    },
    {
      label: "Tanggal Selesai",
      name: "endDate",
      fieldType: types.TYPE_FIELD_DATE,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      //   render: (rowData) => moment(rowData.endDate).format("DD-MM-YYYY"),
    },
    {
      label: "Status",
      name: "auditStatus",
      fieldType: types.TYPE_FIELD_SELECT,
      dataSource: "CUSTOM", // API or CUSTOM
      endPoint: "", // Requeired IF API
      valueColumn: "", // Requeired IF API
      labelColumn: "", // Requeired IF API
      option: [
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" },
      ],
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Disetujui Oleh",
      name: "lastAuditorName",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Catatan",
      name: "auditRemark",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Tanggal Persetujuan",
      name: "auditTime",
      fieldType: types.TYPE_FIELD_DATETIME,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
  ],
};

export const leavePage = data;

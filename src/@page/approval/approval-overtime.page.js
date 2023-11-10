import * as types from "@mid/components/field/types";
import OvertimeTypeComponent from "app/components/OvertimeTypeComponent";
import React from "react";

const data = [];
data["/approval_emp/overtime_approval"] = {
  model: "overtimes",
  endPoint: "overtimes",
  customEndpoint: "approval-list",
  defaultOrder: "createdAt",
  sortDirection: "desc",
  primaryKey: "overtimeId",
  isOverWriteAction: true,
  CustomAction: React.lazy(() => import("@page/custom/CustomActionApproval")),
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
      label: "Jenis Lembur",
      name: "overtimeType",
      fieldType: types.TYPE_FIELD_SELECT,
      dataSource: "CUSTOM", // API or CUSTOM
      endPoint: "", // Requeired IF API
      valueColumn: "", // Requeired IF API
      labelColumn: "", // Requeired IF API
      option: [
        { label: "Normal OT", value: 1 },
        { label: "Weekend OT", value: 2 },
        { label: "Holiday OT", value: 3 },
      ],
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      render: (rowData) => <OvertimeTypeComponent name={rowData.overtimeType} />,
    },
    {
      label: "Alasan",
      name: "applyReason",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Tanggal Mulai",
      name: "startTime",
      fieldType: types.TYPE_FIELD_DATETIME,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
    },
    {
      label: "Tanggal Selesai",
      name: "endTime",
      fieldType: types.TYPE_FIELD_DATETIME,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
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

export const approvalovertimePage = data;

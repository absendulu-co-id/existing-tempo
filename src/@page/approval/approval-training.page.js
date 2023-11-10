import * as types from "@mid/components/field/types";
import React from "react";

const data = [];
data["/approval_emp/training_approval"] = {
  model: "trainings",
  endPoint: "trainings",
  customEndpoint: "approval-list",
  defaultOrder: "createdAt",
  sortDirection: "desc",
  primaryKey: "trainingId",
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
      label: "Jenis Pelatihan",
      name: "trainingTypeName",
      fieldType: types.TYPE_FIELD_SELECT,
      dataSource: "API", // API or CUSTOM
      endPoint: "trainingType", // Requeired IF API
      valueColumn: "trainingTypeId", // Requeired IF API
      labelColumn: "trainingTypeName", // Requeired IF API
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
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
      name: "endTime",
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

export const approvaltrainingPage = data;

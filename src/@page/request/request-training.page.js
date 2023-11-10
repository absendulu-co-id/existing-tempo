import * as types from "@mid/components/field/types";

const data = [];
data["/request/training_request"] = {
  model: "Training",
  endPoint: "Trainings",
  defaultOrder: "startTime",
  primaryKey: "trainingId",
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
      name: "trainingTypeName",
      label: "Jenis Pelatihan",
      fieldType: types.TYPE_FIELD_AUTOCOMPLETE,
      dataSource: "API", // API or CUSTOM
      endPoint: "trainingType", // Requeired IF API
      valueColumn: "trainingTypeId", // Requeired IF API
      labelColumn: "trainingTypeName", // Requeired IF API
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
      name: "applyReason",
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
      name: "startTime",
      label: "Tanggal Mulai",
      fieldType: types.TYPE_FIELD_DATETIME,
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
      name: "endTime",
      label: "Tanggal Selesai",
      fieldType: types.TYPE_FIELD_DATETIME,
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

export const requestTrainingPage = data;

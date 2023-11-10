import * as types from "@mid/components/field/types";
import { GeneralConfig } from "interface";
import moment from "moment";

const data: GeneralConfig = {
  model: "holiday",
  endPoint: "v1/holiday",
  defaultOrder: "holidayName",
  primaryKey: "holidayId",
  // CustomAction: React.lazy(() => import("./custom/test")),
  fields: [
    {
      name: "holidayName",
      label: "Nama Libur",
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
      label: "Departemen",
      name: "departments",
      fieldType: types.TYPE_FIELD_SELECT_MULTIPLE,
      dataSource: "API", // API or CUSTOM
      endPoint: "department", // Requeired IF API
      valueColumn: "departmentId", // Requeired IF API
      labelColumn: "departmentName", // Requeired IF API
      isAlias: true,
      originOptions: true, // option origin from api
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      render: (row) => row.departments?.map((x) => x.departmentName).join(", "),
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
      required: true,
      value: null,
      defaultValue: null,
      render: (rowData) => moment(rowData.startDate).format("LL"),
    },
    {
      name: "duration",
      label: "Durasi",
      fieldType: types.TYPE_FIELD_NUMBER,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      value: 1,
      defaultValue: null,
      render: (rowData) => `${rowData.duration} hari `,
    },
    {
      name: "-",
      label: "Tanggal Berakhir",
      fieldType: types.TYPE_FIELD_DATE,
      isAlias: false,
      allowSearch: false,
      showOnTable: true,
      allowExport: false,
      allowImport: false,
      required: false,
      value: null,
      defaultValue: null,
      showInForm: false,
      render: (rowData) =>
        moment(rowData.startDate)
          .add(rowData.duration - 1, "day")
          .format("LL"),
    },
    // {
    //   name: "workingOnHoliday",
    //   label: "Kerja di Hari Libur",
    //   fieldType: types.TYPE_FIELD_SELECT,
    //   dataSource: "CUSTOM", // API or CUSTOM
    //   endPoint: "", // Requeired IF API
    //   valueColumn: "", // Requeired IF API
    //   labelColumn: "", // Requeired IF API
    //   isAlias: true,
    //   allowSearch: false,
    //   showOnTable: false,
    //   allowExport: false,
    //   allowImport: false,
    //   allowInsert: false,
    //   required: true,
    //   value: 0,
    //   defaultValue: "",
    //   option: [
    //     { label: "Abaikan", value: 0 },
    //     { label: "Pindah ke Hari Kerja Normal", value: 1 },
    //     { label: "Pindah ke Lembur", value: 2 },
    //     { label: "Pindah ke Lembur Akhir Minggu", value: 3 },
    //     { label: "Pindah ke Lembur Hari Libur", value: 4 },
    //   ],
    // },
  ],
};

const data1 = [];
data1["/holidays/holiday"] = data;

export const holidayPage = data1;

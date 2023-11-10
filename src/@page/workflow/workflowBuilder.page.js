import * as types from "@mid/components/field/types";
import ContentTypeComponent, { contentTypes } from "app/components/ContentTypeComponent";
import { converArrayToString } from "app/services/arrayFunction";
import moment from "moment";

const data = [];
data["/workflow/workflowBuilder"] = {
  model: "workflowBuilder",
  endPoint: "workflowBuilders",
  defaultOrder: "workflowBuilderName",
  primaryKey: "workflowBuilderId",
  fields: [
    {
      label: "Kode Workflow Builder",
      name: "workflowBuilderCode",
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
      label: "Nama Workflow Builder",
      name: "workflowBuilderName",
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
      label: "Tanggal Mulai",
      name: "startDate",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      render: (rowData) => moment(rowData.startDate).utc(0).format("DD-MM-YYYY"),
      type: "unix",
    },
    {
      label: "Tanggal Selesai",
      name: "endDate",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      render: (rowData) => moment(rowData.endDate).utc(0).format("DD-MM-YYYY"),
      type: "unix",
    },
    {
      label: "Jenis Konten",
      name: "contentType",
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
      required: false,
      value: null,
      defaultValue: null,
      option: contentTypes.map((item) => ({
        label: item.status,
        value: item.name,
      })),
      render: (rowData) => <ContentTypeComponent name={rowData.contentType} />,
    },
    {
      label: "Karyawan",
      name: "employees",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      render: (rowData) => rowData.employees && converArrayToString(rowData.employees, "employeeId"),
      type: "arrayToString",
      arrayField: "employeeId",
    },
    {
      label: "Departemen",
      name: "departmentName",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
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
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      type: "customObject",
    },
  ],
};

export const workflowBuilderPage = data;

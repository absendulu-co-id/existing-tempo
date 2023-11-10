import * as types from "@mid/components/field/types";
import { converArrayToString } from "app/services/arrayFunction";

const data = [];
data["/workflow/workflowNode"] = {
  model: "workflowNode",
  endPoint: "workflowNode",
  include: "workflowBuilder",
  defaultOrder: "workflowNodeName",
  primaryKey: "workflowNodeId",
  fields: [
    {
      label: "Workflow Builder",
      name: "workflowBuilder.workflowBuilderName",
      sorting: false,
      type: "customObject",
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
      label: "Kode Node",
      name: "workflowNodeNumber",
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
      label: "Nama Node",
      name: "workflowNodeName",
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
      label: "Approver Scope",
      name: "workflowNodeApprover",
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
      render: (rowData) =>
        rowData.workflowNodeApprover && converArrayToString(rowData.workflowNodeApprover, "workflowRoleName"),
      type: "arrayToString",
      arrayField: "workflowRoleName",
    },
    {
      label: "Approver",
      name: "workflowNodeApproverScope",
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
      label: "Notifier Scope",
      name: "workflowNodeNotifier",
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
      render: (rowData) =>
        rowData.workflowNodeNotifier && converArrayToString(rowData.workflowNodeNotifier, "workflowRoleName"),
      type: "arrayToString",
      arrayField: "workflowRoleName",
    },
    {
      label: "Notifier",
      name: "workflowNodeNotifierScope",
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
  ],
};

export const workflowNodePage = data;

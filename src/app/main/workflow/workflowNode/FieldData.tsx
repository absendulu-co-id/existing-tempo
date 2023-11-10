export const FieldData = [
  {
    value: "",
    type: "text",
    name: "workflowNodeNumber",
    label: "Kode Node",
    placeholder: "",
    search: true,
    multiline: false,
    rows: 0,
    rowsMax: 0,
    validations: "isAlphanumeric",
    validationErrors: {
      isAlphanumeric: "Field Harus diisi dan hanya boleh berupa huruf dan angka",
    },
    required: true,
    disabled: true,
  },
  {
    value: "",
    type: "text",
    name: "workflowNodeName",
    label: "Nama Node",
    placeholder: "",
    search: true,
    multiline: false,
    rows: 0,
    rowsMax: 0,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: true,
  },
  {
    value: [],
    type: "select",
    name: "workflowNodeApprover",
    label: "Approver",
    placeholder: "",
    search: true,
    option: null,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: true,
  },
  {
    value: "",
    type: "select",
    name: "workflowNodeApproverScope",
    label: "Approver Scope",
    placeholder: "",
    search: false,
    option: [
      { label: "Own Department", value: "Own Department" },
      { label: "All", value: "All" },
    ],
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: true,
  },
  {
    value: [],
    type: "select",
    name: "workflowNodeNotifier",
    label: "Notifier",
    placeholder: "",
    search: true,
    option: null,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: true,
  },
  {
    value: "",
    type: "select",
    name: "workflowNodeNotifierScope",
    label: "Notifier Scope",
    placeholder: "",
    search: false,
    option: [
      { label: "Own Department", value: "Own Department" },
      { label: "All", value: "All" },
    ],
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: true,
  },
  {
    value: null,
    type: "select",
    name: "organizationId",
    label: "Perusahaan",
    placeholder: "",
    search: true,
    option: null,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: true,
  },
];

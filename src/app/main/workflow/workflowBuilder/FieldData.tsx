import { contentTypes } from "../../../components/ContentTypeComponent";

export const FieldData = [
  {
    value: "",
    type: "date",
    name: "startDate",
    label: "Tanggal Mulai",
    placeholder: "",
    search: false,
    multiline: false,
    rows: 0,
    rowsMax: 0,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa Tanggal",
    },
    required: true,
  },
  {
    value: "",
    type: "date",
    name: "endDate",
    label: "Tanggal Selesai",
    placeholder: "",
    search: false,
    multiline: false,
    rows: 0,
    rowsMax: 0,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa Tanggal",
    },
    required: true,
  },
  {
    value: "",
    type: "text",
    name: "workflowBuilderCode",
    label: "Kode Builder",
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
  },
  {
    value: "",
    type: "text",
    name: "workflowBuilderName",
    label: "Nama Builder",
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
    value: "",
    type: "select",
    name: "contentType",
    label: "Tipe Konten",
    placeholder: "",
    search: true,
    option: contentTypes.map((item) => ({
      label: item.status,
      value: item.name,
    })),
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: true,
  },
  {
    label: "Karyawan",
    value: [],
    type: "text",
    name: "employees",
  },
  {
    value: null,
    type: "select",
    name: "departmentId",
    label: "Departemen",
    placeholder: "",
    search: true,
    option: null,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: false,
  },
  {
    value: null,
    type: "select",
    name: "positionId",
    label: "Jabatan",
    placeholder: "",
    search: true,
    option: null,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: false,
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
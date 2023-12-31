import { FieldData as FieldDataInterface } from "interface/field-data";

export const FieldData: FieldDataInterface[] = [
  // {
  //   value: null,
  //   type: "select",
  //   name: "organizationId",
  //   label: "Perusahaan",
  //   placeholder: "",
  //   search: true,
  //   validations: "isExisty",
  //   validationErrors: {
  //     isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
  //   },
  //   required: true,
  // },
  {
    value: "",
    type: "text",
    name: "employeeId",
    label: "ID Karyawan",
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
    isDisabledEdit: true,
  },
  {
    value: "",
    type: "text",
    name: "employeeName",
    label: "Nama Karyawan",
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
    type: "text",
    name: "email",
    label: "Email",
    placeholder: "",
    search: true,
    multiline: false,
    rows: 0,
    rowsMax: 0,
    validations: "isEmail",
    validationErrors: {
      isEmail: "Email tidak valid",
    },
    required: false,
  },
  {
    value: "",
    type: "date",
    name: "hireDate",
    label: "Tanggal Masuk",
    placeholder: "",
    search: false,
    multiline: false,
    rows: 0,
    rowsMax: 0,
  },
  {
    value: null,
    type: "select",
    name: "employeeTypeId",
    label: "Tipe Karyawan",
    placeholder: "",
    search: true,
    required: false,
  },
  {
    value: null,
    type: "select",
    name: "departmentId",
    label: "Departemen",
    placeholder: "",
    search: true,
    required: false,
  },
  {
    value: [{ areaId: -1 }],
    type: "select",
    name: "areaIdAreas",
    label: "Area",
    placeholder: "",
    search: true,
    required: false,
  },
  {
    value: null,
    type: "select",
    name: "positionId",
    label: "Jabatan",
    placeholder: "",
    search: true,
    required: false,
  },
  {
    value: null,
    type: "select",
    name: "workflowRoleId",
    label: "Workflow Role",
    placeholder: "",
    search: true,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: false,
  },
  {
    type: "select",
    name: "employeeNotifiedIdEmployees",
    label: "Notified Employee",
    placeholder: "",
    search: true,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
    required: false,
  },
  {
    value: "",
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "",
    search: false,
    multiline: false,
    rows: 0,
    rowsMax: 0,
    validations: { minLength: 6 },
    validationErrors: {
      minLength: "Minimal panjang karakter 6",
    },
    required: true,
  },
  {
    value: "",
    type: "password",
    name: "repeat_password",
    label: "Ulangi Password",
    placeholder: "",
    search: false,
    multiline: false,
    rows: 0,
    rowsMax: 0,
    validations: { equalsField: "password" },
    validationErrors: {
      equalsField: "Isi field tidak sama dengan Field Password",
    },
    required: true,
  },
  {
    value: false,
    type: "select",
    name: "appStatus",
    label: "App Status",
    placeholder: "",
    search: false,
    option: [
      { label: "Enable", value: true },
      { label: "Disable", value: false },
    ],
    required: false,
  },
];

export const tabFieldData = [
  {
    name: "Private Information",
    value: "privateInformation",
    fieldData: [
      {
        value: "",
        type: "text",
        name: "nickname",
        label: "Nama Panggilan",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: "",
        type: "select",
        name: "gender",
        label: "Jenis Kelamin",
        placeholder: "",
        search: false,
        option: [
          { label: "Pria", value: "M" },
          { label: "Wanita", value: "F" },
        ],
        required: false,
      },
      {
        value: null,
        type: "date",
        name: "birthday",
        label: "Tanggal Lahir",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
      },
      {
        value: "",
        type: "text",
        name: "contactTel",
        label: "Kontak Telepon",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: "",
        type: "text",
        name: "officeTel",
        label: "Telepon Kantor",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: "",
        type: "text",
        name: "mobile",
        label: "Ponsel",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: "",
        type: "text",
        name: "national",
        label: "Kebangsaan",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: "",
        type: "text",
        name: "religion",
        label: "Agama",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: "",
        type: "text",
        name: "city",
        label: "Kota",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: "",
        type: "text",
        name: "address",
        label: "Alamat",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: "",
        type: "text",
        name: "postcode",
        label: "Kode Pos",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
    ],
  },
  {
    name: "Device Access Setting",
    value: "deviceAccessSetting",
    fieldData: [
      {
        value: "",
        type: "text",
        name: "cardNo",
        label: "Card No",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
      {
        value: 0,
        type: "select",
        name: "devPrivilege",
        label: "Device Privilege",
        placeholder: "",
        search: false,
        option: [
          { label: "Normal User", value: 0 },
          { label: "Register", value: 2 },
          { label: "Admin", value: 6 },
          { label: "User Defined", value: 10 },
          { label: "Super Administrator", value: 14 },
        ],
        required: false,
      },
      {
        value: "",
        type: "text",
        name: "devicePassword",
        label: "Device Password",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        required: false,
      },
    ],
  },
];

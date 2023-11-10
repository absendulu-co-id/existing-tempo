export const tabFieldData = [
  {
    name: "Pengaturan Awal",
    value: "basicSettings",
    fieldData: [
      {
        value: "07:00",
        type: "time",
        name: "checkInStart",
        label: "Batas Mulai Clock In",
        placeholder: "",
        search: false,
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
        value: "08:00",
        type: "time",
        name: "checkInTime",
        label: "Clock In",
        placeholder: "",
        search: false,
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
        value: "10:00",
        type: "time",
        name: "checkInEnd",
        label: "Batas Akhir Clock In",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        validations: "isExisty",
        validationErrors: {
          isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
        },
        required: true,
      },
    ],
    fieldData2: [
      {
        value: "15:00",
        type: "time",
        name: "checkOutStart",
        label: "Batas Mulai Clock Out",
        placeholder: "",
        search: false,
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
        value: "17:00",
        type: "time",
        name: "checkOutTime",
        label: "Clock Out",
        placeholder: "",
        search: false,
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
        value: "19:00",
        type: "time",
        name: "checkOutEnd",
        label: "Batas Akhir Clock Out",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        validations: "isExisty",
        validationErrors: {
          isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
        },
        required: true,
      },
    ],
    fieldData3: [
      {
        value: "11:30",
        type: "time",
        name: "breakInStart",
        label: "Batas Mulai Istirahat",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        validations: "isExisty",
        validationErrors: {
          isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
        },
        required: false,
      },
      {
        value: "12:00",
        type: "time",
        name: "breakIn",
        label: "Istirahat Mulai",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        validations: "isExisty",
        validationErrors: {
          isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
        },
        required: false,
      },
      {
        value: "13:00",
        type: "time",
        name: "breakOut",
        label: "Istirahat Berakhir",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        validations: "isExisty",
        validationErrors: {
          isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
        },
        required: false,
      },
      {
        value: "13:30",
        type: "time",
        name: "breakOutEnd",
        label: "Batas Akhir Istirahat",
        placeholder: "",
        search: false,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        validations: "isExisty",
        validationErrors: {
          isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
        },
        required: false,
      },
    ],
    fieldData4: [
      {
        value: 1,
        type: "text",
        name: "workday",
        label: "Jumlah (Hari Kerja)",
        placeholder: "",
        search: true,
        multiline: false,
        rows: 0,
        rowsMax: 0,
        validations: "isNumeric",
        validationErrors: {
          isNumeric: "Field Harus diisi dan hanya boleh berupa Angka",
        },
        required: true,
      },
    ],
  },
];

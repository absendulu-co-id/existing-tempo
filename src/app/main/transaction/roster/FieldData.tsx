import { GeneralConfigField } from "interface";
import moment from "moment";

export const FieldData: GeneralConfigField[] = [
  {
    value: moment().startOf("month"),
    type: "date",
    name: "startDate",
    label: "Start Date",
    placeholder: "",
    search: true,
    multiline: false,
    rows: 0,
    rowsMax: 0,
  },
  {
    value: moment().endOf("month"),
    type: "date",
    name: "endDate",
    label: "End Date",
    placeholder: "",
    search: true,
    multiline: false,
    rows: 0,
    rowsMax: 0,
  },
  {
    value: null,
    type: "select",
    name: "departmentId",
    label: "Departemen",
    placeholder: "",
    search: true,
    option: null,
    required: true,
  },
];

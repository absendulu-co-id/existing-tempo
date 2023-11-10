import * as types from "@mid/components/field/types";
import { Tooltip } from "@material-ui/core";
import { GeneralConfig } from "interface";
import moment from "moment";

const data: GeneralConfig = {
  model: "timeTable",
  endPoint: "timeTables",
  defaultOrder: "timeTableName",
  primaryKey: "timeTableId",
  fields: [
    {
      label: "Kode Jadwal",
      name: "timeTableId",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
    },
    {
      label: "Nama Jadwal",
      name: "timeTableName",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
    },
    {
      label: "Clock In",
      name: "checkInTime",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      render: (rowData) => {
        const start = moment(rowData.checkInStart, "HH:mm:ss").format("LTS");
        const end = moment(rowData.checkInEnd, "HH:mm:ss").format("LTS");
        return (
          <Tooltip title={`${start}-${end}`} placement="top" arrow>
            <span>{moment(rowData.checkInTime, "HH:mm:ss").format("LTS")}</span>
          </Tooltip>
        );
      },
      cellStyle: {
        backgroundColor: "#B7EA7A",
      },
    },
    {
      label: "Mulai Istirahat",
      name: "breakIn",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      render: (rowData) => {
        const start = moment(rowData.breakInStart, "HH:mm:ss").format("LTS");
        return (
          <Tooltip title={`Start: ${start}`} placement="top" arrow>
            <span>{moment(rowData.breakIn, "HH:mm:ss").format("LTS")}</span>
          </Tooltip>
        );
      },
    },
    {
      label: "Akhir Istirahat",
      name: "breakOut",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      render: (rowData) => {
        const end = moment(rowData.breakOutEnd, "HH:mm:ss").format("LTS");
        return (
          <Tooltip title={`End: ${end}`} placement="top" arrow>
            <span>{moment(rowData.breakOut, "HH:mm:ss").format("LTS")}</span>
          </Tooltip>
        );
      },
    },
    {
      label: "Clock Out",
      name: "checkOutTime",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      render: (rowData) => {
        const start = moment(rowData.checkOutStart, "HH:mm:ss").format("LTS");
        const end = moment(rowData.checkOutEnd, "HH:mm:ss").format("LTS");
        return (
          <Tooltip title={`${start}-${end}`} placement="top" arrow>
            <span>{moment(rowData.checkOutTime, "HH:mm:ss").format("LTS")}</span>
          </Tooltip>
        );
      },
      cellStyle: {
        backgroundColor: "#62BD87",
      },
    },
    {
      label: "Total Jam Kerja",
      name: "workTime",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      render: (rowData) => {
        const breakStart = moment(rowData.breakOut, "HH:mm:ss");
        const breakEnd = moment(rowData.breakIn, "HH:mm:ss");
        let breakDuration = moment.duration(breakEnd.diff(breakStart));
        if (breakDuration.asSeconds() < 0) {
          breakDuration = moment.duration(breakEnd.add(1, "day").diff(breakStart));
        }

        const start = moment(rowData.checkInTime, "HH:mm:ss");
        const end = moment(rowData.checkOutTime, "HH:mm:ss");
        let workDuration = moment.duration(end.diff(start));
        if (workDuration.asSeconds() < 0) {
          workDuration = moment.duration(end.add(1, "day").diff(start));
        }

        let duration = workDuration.subtract(breakDuration);
        if (duration.asSeconds() < 0) duration = moment.duration();

        return (
          <Tooltip
            title={`Work: ${workDuration.format("HH:mm:ss", { trim: false })} | Break: ${breakDuration.format(
              "HH:mm:ss",
              { trim: false },
            )}`}
            placement="top"
            arrow
          >
            <span>{duration.format("HH:mm:ss", { trim: false })}</span>
          </Tooltip>
        );
      },
    },
    // {
    //   label: "Workday",
    //   name: "workday",
    //   fieldType: types.TYPE_FIELD_TEXT,
    //   allowSearch: false,
    //   showOnTable: true,
    //   allowExport: true,
    //   allowImport: true,
    // },
  ],
};

const data1 = [];
data1["/shifts/time_table"] = data;

export const timeTablePage = data1;

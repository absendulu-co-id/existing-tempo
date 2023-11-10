import * as types from "@mid/components/field/types";
import DeviceMenu from "@/app/main/devices/device_list/actions/DeviceMenu";
import { Typography } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Device } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { GeneralConfig } from "interface/general-config";
import React from "react";

const renderList = (data: any) => {
  return (
    <span style={{ whiteSpace: "pre" }}>
      {Object.keys(data).map((key, i) => {
        return (
          <React.Fragment key={key}>
            <Typography component="span" variant="subtitle2" className="mr-1">
              {key}
            </Typography>
            <Typography component="span" variant="body2" className="text-right">
              {data[key]}
            </Typography>
            {"\n"}
          </React.Fragment>
        );
      })}
    </span>
  );
};

const data: GeneralConfig<Device> = {
  model: "device",
  endPoint: "device",
  defaultOrder: "areaName",
  primaryKey: "deviceId",
  CustomAction: DeviceMenu,
  prependContentAddForm: () => {
    return (
      <Alert severity="info">
        <AlertTitle>Tidak Perlu "Tambah Perangkat"</AlertTitle>
        <p>
          Atur perangkat untuk connect ke{" "}
          <code style={{ display: "initial", color: "initial", fontWeight: "bold" }}>
            {window.localStorage.getItem("serverUrl")}
          </code>
          .
        </p>
        <p>
          Jika perangkat sudah terkoneksi ke server maka akan muncul di halaman <b>"Daftar - Perangkat"</b> dan anda
          hanya perlu mengganti <b>"Aktif"</b> menjadi <b>"Ya"</b>
        </p>
      </Alert>
    );
  },
  prependContentTable: () => {
    return (
      <Alert severity="info">
        <AlertTitle>Tips</AlertTitle>
        <ul>
          <li>
            Setelah selesai mendaftar biometrik <i>(terutama wajah)</i> pada perangkat, diharapkan untuk restart
            perangkat, karena ada perangkat yang hanya upload data biometrik pada saat setelah dinyalakan saja.
          </li>
        </ul>
      </Alert>
    );
  },
  fields: [
    {
      name: "isRegistered",
      label: "Aktif",
      fieldType: types.TYPE_FIELD_SELECT,
      dataSource: "CUSTOM", // API or CUSTOM
      endPoint: "", // Requeired IF API
      valueColumn: "", // Requeired IF API
      labelColumn: "", // Requeired IF API
      allowSearch: false,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: true,
      value: "",
      option: [
        { label: "Ya", value: true },
        { label: "Tidak", value: false },
      ],
      render: (rowData) => {
        if (rowData.isRegistered) {
          return <CheckIcon color="primary" />;
        } else {
          return <ClearIcon color="error" />;
        }
      },
      helperText: "Boleh/tidaknya perangkat untuk menyambung ke server (perlu restart perangkat)",
      width: "1%",
      cellStyle: {
        width: "1%",
      },
      headerStyle: {
        width: "1%",
      },
    },
    {
      name: "areaName",
      label: "Area",
      fieldType: types.TYPE_FIELD_AUTOCOMPLETE,
      dataSource: "API",
      endPoint: "area",
      valueColumn: "areaId",
      labelColumn: "areaName",
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: false,
      value: null,
      defaultValue: null,
      helperText: "Penggantian area memerlukan untuk upload ulang data karyawan",
    },
    {
      name: "deviceName",
      label: "Nama",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
      allowSearch: true,
      showOnTable: true,
      allowExport: true,
      allowImport: true,
      required: false,
      helperText: "Kosongkan untuk otomatis mendapatkan nama perangkat (perlu restart perangkat)",
    },
    {
      name: "deviceSn",
      label: "Serial Number",
      fieldType: types.TYPE_FIELD_TEXT,
      validations: "isExisty",
      validationErrors: {
        isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
      },
      allowSearch: false,
      showOnTable: false,
      allowExport: false,
      allowImport: false,
      required: true,
    },

    {
      name: "timezone",
      label: "Timezone",
      fieldType: types.TYPE_FIELD_TEXT,
      allowSearch: false,
      showOnTable: false,
      allowExport: false,
      allowImport: false,
      showInForm: true,
      required: false,
      helperText:
        'Penulisan dalam jam/menit. Contoh: GMT+7 = "7"; GMT-7 = "-7"; GMT+5:30 = "330"  (perlu restart perangkat)',
    },
    {
      name: "",
      label: "Perangkat",
      showOnTable: true,
      showInForm: false,
      render: (rowData) => {
        const data = {
          SN: rowData.deviceSn,
          Tipe:
            rowData.deviceOption != null &&
            "DeviceName" in rowData.deviceOption &&
            "OEMVendor" in rowData.deviceOption &&
            `${rowData.deviceOption.DeviceName}, ${rowData.deviceOption.OEMVendor}`,
          "IP Lokal": rowData.deviceIp,
          Timezone: rowData.timezone,
        };

        return renderList(data);
      },
      renderXls: (rowData) => {
        return JSON.stringify(
          {
            SN: rowData.deviceSn,
            Tipe:
              rowData.deviceOption != null &&
              "DeviceName" in rowData.deviceOption &&
              "OEMVendor" in rowData.deviceOption &&
              `${rowData.deviceOption.DeviceName}, ${rowData.deviceOption.OEMVendor}`,
            "IP Lokal": rowData.deviceIp,
            Timezone: rowData.timezone,
          },
          null,
          2,
        );
      },
    },
    {
      name: "",
      label: "Jumlah",
      showOnTable: true,
      showInForm: false,
      render: (rowData) => {
        if (rowData.deviceOption == null) return;

        const data = {
          Karyawan: rowData.totalEnrolledUser,
          Kehadiran: rowData.totalAttendanceRecord,
          Wajah:
            "MaxFaceCount" in rowData.deviceOption
              ? `${rowData.totalEnrolledFace} / ${rowData.deviceOption.MaxFaceCount}`
              : rowData.totalEnrolledFace,
          Fingerprint:
            "MaxFingerCount" in rowData.deviceOption
              ? `${rowData.totalEnrolledFingerprint} / ${rowData.deviceOption.MaxFingerCount}`
              : rowData.totalEnrolledFingerprint,
          "Telapak Tangan":
            "MaxPvCount" in rowData.deviceOption &&
            "PvCount" in rowData.deviceOption &&
            `${rowData.deviceOption.PvCount} / ${rowData.deviceOption.MaxPvCount}`,
          Nadi:
            "MaxFvCount" in rowData.deviceOption &&
            "FvCount" in rowData.deviceOption &&
            `${rowData.deviceOption.FvCount} / ${rowData.deviceOption.MaxFvCount}`,
        };

        return renderList(data);
      },
      renderXls: (rowData) => {
        if (rowData.deviceOption == null) return;

        return JSON.stringify(
          {
            Karyawan: rowData.totalEnrolledUser,
            Kehadiran: rowData.totalAttendanceRecord,
            Wajah:
              "MaxFaceCount" in rowData.deviceOption
                ? `${rowData.totalEnrolledFace} / ${rowData.deviceOption.MaxFaceCount}`
                : rowData.totalEnrolledFace,
            Fingerprint:
              "MaxFingerCount" in rowData.deviceOption
                ? `${rowData.totalEnrolledFingerprint} / ${rowData.deviceOption.MaxFingerCount}`
                : rowData.totalEnrolledFingerprint,
            "Telapak Tangan":
              "MaxPvCount" in rowData.deviceOption &&
              "PvCount" in rowData.deviceOption &&
              `${rowData.deviceOption.PvCount} / ${rowData.deviceOption.MaxPvCount}`,
            Nadi:
              "MaxFvCount" in rowData.deviceOption &&
              "FvCount" in rowData.deviceOption &&
              `${rowData.deviceOption.FvCount} / ${rowData.deviceOption.MaxFvCount}`,
          },
          null,
          2,
        );
      },
    },
    {
      name: "",
      label: "Versi",
      showOnTable: true,
      showInForm: false,
      render: (rowData) => {
        if (rowData.deviceOption == null) return;

        const data = {
          Firmware: "FWVersion" in rowData.deviceOption && rowData.deviceOption.FWVersion,
          Wajah: "FaceVersion" in rowData.deviceOption && rowData.deviceOption.FaceVersion,
          Fingerprint: "FPVersion" in rowData.deviceOption && rowData.deviceOption.FPVersion,
          "Telapak Tangan": "PvVersion" in rowData.deviceOption && rowData.deviceOption.PvVersion,
          Nadi: "FvVersion" in rowData.deviceOption && rowData.deviceOption.FvVersion,
          // Bio: "MultiBioVersion" in rowData.deviceOption && rowData.deviceOption.MultiBioVersion,
        };

        return renderList(data);
      },
      renderXls: (rowData) => {
        if (rowData.deviceOption == null) return;

        return JSON.stringify(
          {
            Firmware: "FWVersion" in rowData.deviceOption && rowData.deviceOption.FWVersion,
            Wajah: "FaceVersion" in rowData.deviceOption && rowData.deviceOption.FaceVersion,
            Fingerprint: "FPVersion" in rowData.deviceOption && rowData.deviceOption.FPVersion,
            "Telapak Tangan": "PvVersion" in rowData.deviceOption && rowData.deviceOption.PvVersion,
            Nadi: "FvVersion" in rowData.deviceOption && rowData.deviceOption.FvVersion,
            // Bio: "MultiBioVersion" in rowData.deviceOption && rowData.deviceOption.MultiBioVersion,
          },
          null,
          2,
        );
      },
    },
    // {
    //   name: "lastHeartbeat",
    //   label: "Terakhir aktif",
    //   fieldType: types.TYPE_FIELD_TEXT,
    //   allowSearch: false,
    //   showOnTable: true,
    //   allowExport: true,
    //   allowImport: true,
    //   showInForm: false,
    //   required: false,
    //   hidden: true,
    //   render: (row) => {
    //     const lastHeartbeat = moment(row.lastHeartbeat);
    //     if (lastHeartbeat.isValid()) {
    //       return (<span title={lastHeartbeat.format("lll.ss")}>{lastHeartbeat.fromNow()}</span>);
    //     } else {
    //       return <SvgIcon component={ErrorIcon} color="error"/>;
    //     }
    //   },
    // },
    // {
    //   name: "heartbeat",
    //   label: "Heart Beat",
    //   fieldType: types.TYPE_FIELD_TEXT,
    //   validations: "isExisty",
    //   validationErrors: {
    //     isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    //   },
    //   allowSearch: false,
    //   showOnTable: false,
    //   allowExport: true,
    //   allowImport: true,
    //   required: true,
    // },
    // {
    //   name: "transferMode",
    //   label: "Transfer Mode",
    //   fieldType: types.TYPE_FIELD_SELECT,
    //   dataSource: "CUSTOM", //API or CUSTOM
    //   endPoint: "", // Requeired IF API
    //   valueColumn: "", // Requeired IF API
    //   labelColumn: "", // Requeired IF API
    //   isAlias: true,
    //   allowSearch: false,
    //   showOnTable: false,
    //   allowExport: true,
    //   allowImport: true,
    //   required: true,
    //   value: "",
    //   option: [
    //     { label: "Timing", value: 1 },
    //     { label: "Real Time", value: 2 },
    //   ],
    // },
    // {
    //   name: "transferInterval",
    //   label: "Transfer Interval",
    //   fieldType: types.TYPE_FIELD_TEXT,
    //   validations: "isExisty",
    //   validationErrors: {
    //     isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    //   },
    //   allowSearch: false,
    //   showOnTable: false,
    //   allowExport: true,
    //   allowImport: true,
    //   required: true,
    // },
    // {
    //   name: "transferTime",
    //   label: "Transfer Time",
    //   fieldType: types.TYPE_FIELD_TEXT,
    //   validations: "isExisty",
    //   validationErrors: {
    //     isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    //   },
    //   allowSearch: false,
    //   showOnTable: false,
    //   allowExport: true,
    //   allowImport: true,
    //   required: true,
    // },
    // {
    //   name: "organizationName",
    //   label: "Perusahaan",
    //   fieldType: types.TYPE_FIELD_AUTOCOMPLETE,
    //   dataSource: "API", //API or CUSTOM
    //   endPoint: "organizations", // Requeired IF API
    //   valueColumn: "organizationId", // Requeired IF API
    //   labelColumn: "organizationName", // Requeired IF API
    //   allowSearch: false,
    //   showOnTable: false,
    //   allowExport: true,
    //   allowImport: true,
    //   required: false,
    //   value: null,
    //   defaultValue: null,
    // },
  ],
};

const data1 = [];
data1["/devices/device_list"] = data;

export const devicePage = data1;

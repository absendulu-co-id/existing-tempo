import { defaultInputRanges, defaultStaticRanges } from "../../../components/DefineRangeStaticComponent";
import ExportExcelComponent from "../../../components/ExportExcelComponent";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { attendanceReportConfig } from "./Config";
import { FuseLoading, FusePageCarded } from "@fuse";
import {
  Chip,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Theme,
  withStyles,
} from "@material-ui/core";
import { Alert, AlertTitle, Autocomplete } from "@material-ui/lab";
import { WithStyles } from "@material-ui/styles";
import { Area, Department, Employee } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { AccordionSearch } from "app/components/AccordionSearch";
import { MyColumn, MyMaterialTable } from "app/components/MyMaterialTable";
import { RootState } from "app/store";
import axios from "axios";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { id as dateFnsId } from "date-fns/locale";
import { RootObjectRows } from "interface";
import moment from "moment";
import React, { Component } from "react";
import { DateRangePicker } from "react-date-range";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import { Link as RouterLink } from "react-router-dom";

const timeFormatRender = (row, property) => {
  if (row == null || row[property] == null) return;
  const roster = moment(row.employeeRosterDateTime);
  const time = moment(row[property]);

  if (roster.isSame(time, "D")) {
    return time.format("LTS");
  } else {
    return time.format("L LTS");
  }
};

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  urlParams: string;
  spinner: boolean;
  redirect: boolean;
  data: any;
  allData: any[];
  departmentData: Department[];
  employeeData: Employee[];
  areaData: Area[];
  openDateRange: boolean;
  dateRange: { startDate: Date; endDate: Date };
  loading: boolean;
  filterDepartmentId: string;
  filterAreaId: string;
}

const styles = (theme: Theme) =>
  createStyles({
    layoutRoot: {},
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  });

class List extends Component<Props, States> {
  state: States = {
    urlParams: "",
    spinner: true,
    redirect: false,
    data: {},
    allData: [],
    departmentData: [],
    employeeData: [],
    areaData: [],
    openDateRange: false,
    dateRange: {
      startDate: startOfMonth(new Date()),
      endDate: new Date(),
    },
    loading: false,
    filterDepartmentId: "",
    filterAreaId: "",
  };

  columns: MyColumn<any>[] = [
    {
      title: "NIK",
      field: "employeeId",
    },
    {
      title: "Karyawan",
      field: "employee.employeeName",
      render: (rowData) => rowData.employee?.employeeName ?? "",
      xlsType: "render",
    },
    {
      title: "Departmen",
      xlsType: "render",
      hidden: true,
      render: (rowData) =>
        this.state.departmentData.find((x) => x.departmentId == rowData.employee?.departmentId)?.departmentName,
    },
    {
      title: "Posisi",
      xlsType: "render",
      hidden: true,
      render: (rowData) => this.state.employeeData.find((x) => x.employeeId == rowData.employeeId)?.positionName,
    },
    {
      title: "Area",
      xlsType: "render",
      hidden: true,
      render: (rowData) =>
        this.state.employeeData
          .find((x) => x.employeeId == rowData.employeeId)
          ?.areaIdAreas.map((x) => x.areaName)
          ?.join(", "),
    },
    {
      title: "Jadwal",
      field: "employeeRosterDateTime",
      xlsType: "render",
      render: (rowData) => moment(rowData.employeeRosterDateTime).format("L"),
    },
    {
      title: "Jam Kerja",
      field: "workingHour",
      xlsType: "render",
      render: (row) => {
        if (row?.workingHour == null) return;
        const temp = row.workingHour.split("-").map((x) => x.trim());
        const [start, end] = temp.map((x) => moment(x, "HH:mm:ss"));

        return `${start.format("LT")}-${end.format("LT")}`;
      },
    },
    {
      title: "Aktifitas",
      field: "activity",
      render: (row) => {
        if (row.activity == "absent") {
          return <Chip label="Absen" size="small" style={{ backgroundColor: "crimson", color: "white" }} />;
        } else if (row.activity.startsWith("-")) {
          return <Chip label="Tidak ada shift" size="small" style={{ color: "#A3A3A3" }} />;
        } else if (row.activity.startsWith("holiday")) {
          return <Chip label={row.activity.toCapitalCase()} size="small" style={{ backgroundColor: "HotPink" }} />;
        } else if (row.activity == "work") {
          return <Chip label={row.activity.toCapitalCase()} size="small" color="primary" />;
        } else if (row.activity == "leave") {
          return <Chip label={row.activity.toCapitalCase()} size="small" style={{ backgroundColor: "gold" }} />;
        } else if (row.activity == "training") {
          return (
            <Chip
              label={row.activity.toCapitalCase()}
              size="small"
              style={{ backgroundColor: "CornflowerBlue", color: "white" }}
            />
          );
        }

        return <Chip label={row.activity} size="small" style={{ backgroundColor: "black", color: "white" }}></Chip>;
      },
      exportTransformer: (row) => {
        if (row.activity.startsWith("-")) {
          return "Tidak ada shift";
        }
        switch (row.activity) {
          case "absent":
            return "Absen";
          default:
            return row.activity.toCapitalCase();
        }
      },
    },
    {
      title: "Clock In",
      field: "checkInTime",
      xlsType: "render",
      render: (row) => timeFormatRender(row, "checkInTime"),
    },
    {
      title: "Mulai Istirahat",
      field: "breakInTime",
      xlsType: "render",
      render: (row) => timeFormatRender(row, "breakInTime"),
    },
    {
      title: "Akhir Istirahat",
      field: "breakOutTime",
      xlsType: "render",
      render: (row) => timeFormatRender(row, "breakOutTime"),
    },
    {
      title: "Clock Out",
      field: "checkOutTime",
      xlsType: "render",
      render: (row) => timeFormatRender(row, "checkOutTime"),
    },
    {
      title: "Durasi Datang Awal",
      field: "checkInEarly",
      hidden: true,
    },
    {
      title: "Durasi Datang Terlambat",
      field: "checkInLate",
      xlsType: "render",
      render: (row) =>
        row.checkInLate != null ? <span style={{ color: "firebrick" }}>{row.checkInLate}</span> : undefined,
      renderXls: (row) => row.checkInLate,
      exportTransformer: (row) => row.checkInLate ?? "",
    },
    {
      title: "Durasi Pulang Cepat",
      field: "checkOutEarly",
      hidden: true,
    },
    {
      title: "Durasi Pulang Terlambat",
      field: "checkOutLate",
      xlsType: "render",
      render: (row) =>
        row.checkOutLate != null ? <span style={{ color: "MediumBlue" }}>{row.checkOutLate}</span> : undefined,
      renderXls: (row) => row.checkOutLate,
    },
    {
      title: "Total Jam Kerja",
      field: "totalWorkingHour",
    },
    {
      title: "Catatan",
      field: "note",
      exportTransformer: (row) => row.note ?? "",
    },
  ];

  handleSearching = async () => {
    this.setState({
      openDateRange: false,
      urlParams: "",
    });
    history.push("?page=1");

    await this.getAllDataWithFilter();
  };

  handleQueryParams = async () => {
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);
    const page = parseInt(searchParams.get("page") ?? "1");

    const data = {};
    let urlParams = "";
    for (const key of searchParams.keys()) {
      if (key == "page") {
        continue;
      }

      const value = searchParams.get(key);

      if (key == "startDate" || key == "endDate") {
        let date = moment(value, "DD-MM-YYYY");
        if (key == "startDate") {
          date = date.startOf("day");
        } else if (key == "endDate") {
          date = date.endOf("day");
        }

        this.setState((prevState) => ({
          dateRange: {
            ...prevState.dateRange,
            [key]: date.toDate(),
          },
        }));
      }

      urlParams += `&${key}=${value}`;
      data[key] = value;
    }
    history.push(attendanceReportConfig.routes[0].path + "/?page=" + page + encodeURI(urlParams));

    this.setState((prevState) => ({
      urlParams,
      data: {
        ...prevState.data,
        ...data,
      },
    }));
    await this.getAllDataWithFilter();
  };

  handleInputChange = (event) => {
    const nama = event.target.name;
    const value = event.target.value;
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        [nama]: value,
      },
    }));
  };

  handleInputChangeEmployee = (event, value) => {
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        employeeId: value?.employeeId,
      },
    }));
  };

  handleInputChangeDepartment = (event) => {
    const value = event.target.value;
    this.setState({
      filterDepartmentId: value,
    });
  };

  handleInputChangeArea = (event) => {
    const value = event.target.value;
    this.setState({
      filterAreaId: value,
    });
  };

  handleDateRangeChange = (ranges) => {
    this.setState({
      dateRange: {
        startDate: ranges.range1.startDate,
        endDate: ranges.range1.endDate,
      },
    });
  };

  handleClear = async () => {
    history.push(attendanceReportConfig.routes[0].path + "/?page=1");
    this.setState({
      data: [],
      urlParams: "",
      dateRange: {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      },
      filterDepartmentId: "",
      filterAreaId: "",
    });
    await this.getAllDataWithFilter();
  };

  getAllDataWithFilter = async () => {
    this.setState({
      spinner: true,
    });

    const { defaultEmployeeId } = this.props.user.data;
    const { data } = this.state;

    const startOfDay = moment(this.state.dateRange.startDate).startOf("days").toISOString(true);
    const endOfDay = moment(this.state.dateRange.endDate).endOf("days").toISOString(true);

    let paramData = Object.keys(data)
      .map((key) => {
        if (data[key] == null) {
          return null;
        }
        return { [`filter[where][${key}]`]: data[key] };
      })
      .filter((x) => x != null);
    paramData = Object.assign({}, ...paramData);

    const res = await axios.get(`/${attendanceReportConfig.endPoint}`, {
      params: {
        "filter[order]": "employeeRosterDateTime desc",
        ...(this.state.dateRange != null
          ? {
              "filter[where][employeeRosterDateTime][between][0]": startOfDay,
              "filter[where][employeeRosterDateTime][between][1]": endOfDay,
            }
          : {}),
        ...(defaultEmployeeId != null ? { "filter[where][employeeId]": defaultEmployeeId } : {}),
        ...(this.state.filterDepartmentId != "" ? { departmentId: this.state.filterDepartmentId } : {}),
        ...(this.state.filterAreaId != "" ? { areaId: this.state.filterAreaId } : {}),
        ...paramData,
      },
    });

    this.setState({
      allData: res.data.rows,
      spinner: false,
    });
  };

  getSearchData = async () => {
    const res = await Promise.all([
      axios.get<RootObjectRows<Employee>>("/employees?filter[order]=employeeName%20asc"),
      axios.get<RootObjectRows<Department>>("/department"),
      axios.get<RootObjectRows<Area>>("/area"),
    ]);

    this.setState({
      employeeData: res[0].data.rows ?? [],
      departmentData: res[1].data.rows ?? [],
      areaData: res[2].data.rows ?? [],
    });
  };

  async componentDidMount() {
    await Promise.all([this.getSearchData(), this.handleQueryParams()]);
  }

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME ?? ""} | ${title2 ?? ""}`;

    if (redirect) {
      return <Redirect to="/login" />;
    } else if (loading) {
      return <FuseLoading />;
    }

    return (
      <FusePageCarded
        classes={{
          root: classes.layoutRoot,
        }}
        header={<HeaderComponent breadcrumbs={[title, title2]} titlePage={title2} />}
        contentToolbar={
          <div className="px-24">
            <h2>{title2}</h2>
          </div>
        }
        content={
          <div className="pb-24 m-12">
            <AccordionSearch onClearSearch={this.handleClear} onSearch={this.handleSearching}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Rentang Tanggal Transaksi"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      shrink: !!this.state.dateRange,
                    }}
                    onClick={() =>
                      this.setState({
                        openDateRange: !this.state.openDateRange,
                      })
                    }
                    value={
                      this.state.dateRange
                        ? format(this.state.dateRange.startDate, "dd/MM/yyyy") +
                          " - " +
                          format(this.state.dateRange.endDate, "dd/MM/yyyy")
                        : null
                    }
                  />
                  {this.state.openDateRange && (
                    <DateRangePicker
                      onChange={this.handleDateRangeChange}
                      moveRangeOnFirstSelection={false}
                      ranges={[this.state.dateRange]}
                      direction="horizontal"
                      locale={dateFnsId}
                      staticRanges={defaultStaticRanges}
                      inputRanges={defaultInputRanges}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    value={this.state.data.employeeId}
                    fullWidth
                    options={this.state.employeeData}
                    onChange={this.handleInputChangeEmployee}
                    getOptionLabel={(option) => option.employeeName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{
                          width: "100%",
                        }}
                        label="Karyawan"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Departemen</InputLabel>
                    <Select
                      value={this.state.filterDepartmentId}
                      onChange={this.handleInputChangeDepartment}
                      label="Departmen"
                    >
                      <MenuItem value="">None</MenuItem>
                      {this.state.departmentData.map((item) => {
                        return (
                          <MenuItem key={item.departmentId} value={item.departmentId}>
                            {item.departmentName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Area</InputLabel>
                    <Select value={this.state.filterAreaId} onChange={this.handleInputChangeArea} label="Area">
                      <MenuItem value="">None</MenuItem>
                      {this.state.areaData.map((area) => {
                        return (
                          <MenuItem key={area.areaId} value={area.areaId}>
                            {area.areaName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionSearch>

            <Alert severity="info" className="mb-16">
              <AlertTitle>Tips</AlertTitle>
              Jika Laporan Kehadiran tidak terupdate otomatis, Anda bisa lakukan kalkulasi ulang di&nbsp;
              <Link color="inherit" component={RouterLink} to="/roster_management/process">
                Roster Mangement &gt; Process
              </Link>
            </Alert>

            <Grid container spacing={2} className="mb-16">
              <Grid item>
                <ExportExcelComponent
                  filename={title2}
                  columns={this.columns}
                  data={this.state.allData}
                  className="ml-8"
                />
              </Grid>
            </Grid>

            <MyMaterialTable
              columns={this.columns}
              data={this.state.allData}
              isLoading={this.state.spinner}
              options={{
                rowStyle: (data: any, index: number, level: number): React.CSSProperties => {
                  if (data.lateIn != null) {
                    return {
                      backgroundColor: "LightPink",
                    };
                  }
                  if (data.activity.startsWith("-") || data.activity.startsWith("holiday")) {
                    return {
                      color: "#D4D4D4",
                    };
                  }
                  return {};
                },
                defaultOrderByCollection: [
                  {
                    orderBy: 5,
                    orderDirection: "desc",
                    sortOrder: 1,
                  },
                  {
                    orderBy: 1,
                    orderDirection: "asc",
                    sortOrder: 2,
                  },
                ],
                maxColumnSort: 2,
                columnsButton: true,
                showExport: true,
                exportFileName: title2,
              }}
            />
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(List)));

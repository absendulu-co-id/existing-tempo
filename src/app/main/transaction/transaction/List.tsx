import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import { defaultInputRanges, defaultStaticRanges } from "../../../components/DefineRangeStaticComponent";
import ExportExcelComponent from "../../../components/ExportExcelComponent";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { transactionListConfig } from "./Config";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Grid, StyleRules, TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { AccordionSearch } from "app/components/AccordionSearch";
import { MyColumn, MyMaterialTable } from "app/components/MyMaterialTable";
import { RootState } from "app/store";
import axios, { AxiosError } from "axios";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { id as dateFnsId } from "date-fns/locale";
import moment from "moment";
import { Component } from "react";
import { DateRangePicker } from "react-date-range";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import Swal from "sweetalert2/dist/sweetalert2.js";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  navigationAccess: {
    allowAdd: boolean;
    allowEdit: boolean;
    allowDelete: boolean;
    allowExport: boolean;
  };
  params: string;
  order: boolean;
  orderBy: string;
  spinner: boolean;
  loading: boolean;
  redirect: boolean;
  data: any;
  allData: any[];
  employeeData: any[];
  openDateRange: boolean;
  dateRange: {
    startDate: Date;
    endDate: Date;
  }[];
}

const styles = (theme: Theme): StyleRules => ({
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
    navigationAccess: {
      allowAdd: false,
      allowEdit: false,
      allowDelete: false,
      allowExport: false,
    },
    params: "",
    order: true,
    orderBy: "atttime",
    spinner: true,
    loading: false,
    redirect: false,
    data: [],
    allData: [],
    employeeData: [],
    openDateRange: false,
    dateRange: [
      {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      },
    ],
  };

  columns: MyColumn<any>[] = [
    // {
    //   title: "ID",
    //   field: "deviceAttendanceId",
    // },
    {
      title: "NIK",
      field: "pin",
    },
    {
      title: "Karyawan",
      field: "pinEmployee.employeeName",
      render: (rowData) => rowData.pinEmployee?.employeeName,
      xlsType: "render",
    },
    {
      title: "Tanggal",
      field: "atttime",
      xlsType: "date",
      render: (rowData) => <p>{moment(rowData.atttime).format("L")}</p>,
    },
    {
      title: "Waktu",
      field: "atttime",
      xlsType: "time",
      render: (rowData) => <p>{moment(rowData.atttime).format("LTS")}</p>,
    },
    {
      title: "SN Perangkat",
      field: "deviceSn",
    },
    {
      title: "Nama Perangkat",
      field: "device.deviceName",
      renderXls: (rowData) => rowData.device?.deviceName,
      xlsType: "render",
    },
    {
      title: "Area Perangkat",
      field: "device.area.areaName",
      renderXls: (rowData) => rowData.device?.deviceName,
      xlsType: "render",
    },
    {
      title: "Tipe",
      field: "attendanceType",
    },
    {
      title: "Metode",
      field: "attendanceMethod",
    },
  ];

  handleSearching = async () => {
    this.setState({
      spinner: true,
      openDateRange: false,
    });
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
        pin: value?.employeeId,
      },
    }));
  };

  handleDateRangeChange = (ranges) => {
    this.setState({
      dateRange: [
        {
          startDate: ranges.range1.startDate,
          endDate: ranges.range1.endDate,
        },
      ],
    });
  };

  handleClear = () => {
    history.push(transactionListConfig.routes[0].path + "/?page=1");
    this.setState(
      {
        data: [],
        allData: [],
        dateRange: [
          {
            startDate: startOfMonth(new Date()),
            endDate: endOfMonth(new Date()),
          },
        ],
      },
      async () => {
        await this.getAllDataWithFilter();
      },
    );
  };

  getAllDataWithFilter = async () => {
    this.setState({ spinner: true });

    try {
      const res = await axios.get(`/${transactionListConfig.endPoint}`, {
        params: {
          orderBy: "atttime desc",
          start: moment(this.state.dateRange[0].startDate).startOf("days").toISOString(true),
          end: moment(this.state.dateRange[0].endDate).endOf("days").toISOString(true),
          ...(this.state.data.pin != null ? { pin: this.state.data.pin } : {}),
        },
      });

      this.setState({
        allData: res.data.data,
        spinner: false,
      });
    } catch (error1: unknown) {
      const error = error1 as AxiosError;

      if (error.response?.status == 404) {
        this.setState({
          allData: [],
          spinner: false,
        });
      } else {
        await Swal.fire({
          title: "Error",
          text: error.response?.data.message,
          icon: "error",
        });
      }
    }
  };

  async componentDidMount() {
    await Promise.all([
      axios.get("/employees?filter[order]=employeeName%20asc").then((res) => {
        this.setState({ employeeData: res.data.rows });
      }),
      this.getAllDataWithFilter(),
    ]);
  }

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;

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
          <div className="mb-24 m-12">
            <AccordionSearch onClearSearch={this.handleClear} onSearch={this.handleSearching}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Rentang Tanggal Kehadiran"
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
                        ? format(this.state.dateRange[0].startDate, "dd/MM/yyyy") +
                          " - " +
                          format(this.state.dateRange[0].endDate, "dd/MM/yyyy")
                        : null
                    }
                  />
                  {this.state.openDateRange && (
                    <DateRangePicker
                      onChange={this.handleDateRangeChange}
                      moveRangeOnFirstSelection={false}
                      ranges={this.state.dateRange}
                      direction="horizontal"
                      locale={dateFnsId}
                      staticRanges={defaultStaticRanges}
                      inputRanges={defaultInputRanges}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    value={this.state.data.pin}
                    fullWidth
                    options={this.state.employeeData}
                    onChange={this.handleInputChangeEmployee}
                    getOptionLabel={(option) => option.employeeName}
                    renderInput={(params) => <TextField {...params} label="Karyawan" variant="outlined" />}
                  />
                </Grid>
              </Grid>
            </AccordionSearch>

            <ExportExcelComponent
              filename={title2}
              className="mb-16"
              columns={this.columns}
              data={this.state.allData}
            />

            <MyMaterialTable columns={this.columns} data={this.state.allData} isLoading={this.state.spinner} />
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  setNavigation: Actions.setNavigation,
  setUser: AuthActions.setUser,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(List)));

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import { defaultInputRanges, defaultStaticRanges } from "../../../components/DefineRangeStaticComponent";
import ExportExcelComponent from "../../../components/ExportExcelComponent";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { mobileLogConfig } from "./Config";
import { FuseLoading, FusePageCarded } from "@fuse";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  StyleRules,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { AccordionSearch } from "app/components/AccordionSearch";
import { MyColumn, MyMaterialTable } from "app/components/MyMaterialTable";
import { RootState } from "app/store";
import axios from "axios";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { id as dateFnsId } from "date-fns/locale";
import moment from "moment";
import React, { Component } from "react";
import { DateRangePicker } from "react-date-range";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import Swal from "sweetalert2/dist/sweetalert2.js";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  primaryKey: string;
  navigationAccess: {
    allowAdd: boolean;
    allowEdit: boolean;
    allowDelete: boolean;
    allowExport: boolean;
  };
  urlParams: string;
  params: string;
  queryParams: string;
  order: boolean;
  orderBy: string;
  spinner: boolean;
  loading: boolean;
  redirect: boolean;
  perPage: number;
  data: any;
  formData: any;
  allData: any[];
  departmentData: any[];
  employeeData: any[];
  openDateRange: boolean;
  currentPage: number;
  dateRange: {
    startDate: Date;
    endDate: Date;
  }[];
  openImage: boolean;
  rowDetail?: any;
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
    primaryKey: "attendanceId",
    navigationAccess: {
      allowAdd: false,
      allowEdit: false,
      allowDelete: false,
      allowExport: false,
    },
    urlParams: "",
    params: "",
    queryParams: "",
    order: true,
    orderBy: "createdAt",
    spinner: false,
    loading: false,
    redirect: false,
    perPage: 10,
    data: {},
    formData: [],
    allData: [],
    departmentData: [],
    employeeData: [],
    openDateRange: false,
    currentPage: 1,
    dateRange: [
      {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      },
    ],
    openImage: false,
    rowDetail: undefined,
  };

  columns: MyColumn<any>[] = [
    {
      title: "NIK",
      field: "employeeId",
    },
    {
      title: "Karyawan",
      field: "employee.employeeName",
      render: (rowData) => (rowData.employee ? rowData.employee.employeeName : ""),
      xlsType: "render",
    },
    {
      title: "Departemen",
      field: "employee.departmentName",
      renderXls: (rowData) => rowData.employee.departmentName,
      xlsType: "render",
    },
    {
      title: "Tanggal",
      field: "createdAt",
      xlsType: "date",
      render: (rowData) => <p>{moment(rowData.createdAt).format("L")}</p>,
    },
    {
      title: "Waktu",
      field: "createdAt",
      xlsType: "time",
      render: (rowData) => <p>{moment(rowData.createdAt).format("LTS")}</p>,
    },
    {
      title: "Tipe",
      field: "attendanceType",
    },
    {
      title: "Alamat",
      field: "locationAddress",
      xlsType: "render",
      render: (rowData) => (
        <p>
          <IconButton
            size="small"
            component={"a" as any}
            href={`https://maps.google.com/?q=${rowData.latitude},${rowData.longitude}`}
            target="_blank"
          >
            <iconify-icon icon="logos:google-maps"></iconify-icon>
          </IconButton>
          {rowData.locationAddress}
        </p>
      ),
      renderXls: (rowData) => rowData.locationAddress,
    },
    {
      title: "Lokasi",
      xlsType: "render",
      hidden: true,
      renderXls: (rowData) => `https://maps.google.com/?q=${rowData.latitude},${rowData.longitude}`,
    },
    {
      title: "Note",
      field: "note",
    },
    {
      title: "Disetujui?",
      field: "isApproved",
      xlsType: "render",
      render: (rowData) => (rowData.isApproved ? "Ya" : "Tidak"),
    },
    {
      title: "Gambar",
      field: "attendanceImage",
      sorting: false,
      render: (rowData) => (
        <img
          decoding="async"
          alt="Photo"
          src={rowData.attendanceImage}
          style={{ maxWidth: "250px", maxHeight: "200px" }}
          className="cursor-pointer"
          onClick={() =>
            this.setState({
              rowDetail: rowData,
              openImage: true,
            })
          }
        />
      ),
    },
  ];

  handleSearching = async () => {
    this.setState({
      openDateRange: false,
    });
    let params = "";
    let queryParams = "";
    const data = this.state.data;

    Object.keys(data).forEach((key, index) => {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete data[key];
      } else {
        queryParams += "&" + key + "=" + data[key];
        params += "&filter[where][" + key + "]=" + data[key] + "";
      }
    });

    this.setState({
      urlParams: queryParams,
      params,
      currentPage: 1,
    });
    history.push("?page=" + 1 + "" + encodeURI(queryParams));

    await this.getAllDataWithFilter(params);
  };

  handleClick = (page) => {
    history.push("?page=" + page + "" + encodeURI(this.state.urlParams));
    this.setState({
      currentPage: page,
    });
  };

  handleQueryParams = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const page1 = parseInt(searchParams.get("page") ?? "1");
    const page = isNaN(page1) ? page1 : 1;

    const data = {};
    let params = "";
    let countParams = "";
    let urlParams = "";
    let index = 0;
    for (const value of searchParams.keys()) {
      if (value !== "page") {
        if (value === "startDate" || value === "endDate") {
          let date = moment(searchParams.get(value), "DD-MM-YYYY");
          date = value == "startDate" ? date.startOf("days") : date.endOf("days");
          if (value === "startDate") {
            this.setState(() => ({
              dateRange: [
                {
                  startDate: date.toDate(),
                  endDate: date.toDate(),
                },
              ],
            }));
          } else {
            this.setState((prevState) => ({
              dateRange: [
                {
                  ...prevState.dateRange[0],
                  [value]: date.toDate(),
                },
              ],
            }));
          }
        }
        urlParams = urlParams + "&" + value + "=" + searchParams.get(value);
        params = params + "&filter[where][" + value + "]=" + searchParams.get(value) + "";
        data[value] = searchParams.get(value);
        if (index === 0) {
          countParams = "where[" + value + "]=" + searchParams.get(value) + "";
        } else {
          countParams = countParams + "&where[" + value + "]=" + searchParams.get(value) + "";
        }
      }
      index++;
    }
    history.push(mobileLogConfig.routes[0].path + "/?page=" + page + "" + encodeURI(urlParams));

    this.setState((prevState) => ({
      currentPage: page,
      urlParams,
      params,
      data: {
        ...prevState.data,
        ...data,
      },
    }));

    await this.getAllDataWithFilter(params);
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
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        departmentId: event.target.value,
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

  handleUpdateRow = async (status) => {
    const data = this.state.rowDetail;

    const swalResult = await Swal.fire({
      title: "Konfirmasi",
      html: `Apakah Anda yakin untuk <b>${data.isApproved ? "membatalkan" : "menyetujui"}</b> kehadiran <b>${
        data.employee.employeeName
      } (${data.employeeId})</b> pada <b>${moment(data.createdAt).format("L LTS")}</b>?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (!swalResult.isConfirmed) {
      return;
    }

    this.setState({ loading: true });
    const res = await axios.patch(`/${mobileLogConfig.endPoint}/${data[this.state.primaryKey]}`, {
      isApproved: status,
    });
    if (res.status == 200) {
      void Swal.fire("Sukses!", "Data berhasil diubah!", "success");
      this.setState({
        rowDetail: null,
      });

      await this.handleQueryParams();
    } else {
      await Swal.fire("Error!", "Maaf, terjadi kesalahan.", "error");
      window.location.reload();
    }
    this.setState({ loading: false });
  };

  handleClear = async () => {
    history.push(mobileLogConfig.routes[0].path + "/?page=1");
    this.setState({
      data: [],
      params: "",
      urlParams: "",
      allData: [],
      dateRange: [
        {
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
        },
      ],
    });
    await this.componentDidMount();
  };

  getAllDataWithFilter = async (params) => {
    this.setState({ spinner: true });

    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin" && this.props.user.data.defaultOrganizationAccess
        ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
        : "";

    const startOfDay = this.state.dateRange
      ? moment(this.state.dateRange[0].startDate).startOf("days").toISOString()
      : undefined;
    const endOfDay = this.state.dateRange
      ? moment(this.state.dateRange[0].endDate).endOf("days").toISOString()
      : undefined;

    const { order, orderBy } = this.state;

    const res = await axios.get(
      `/${mobileLogConfig.endPoint}?${order ? "asc" : "desc"}${params}${filterDefaultOrganization}`,
      {
        params: {
          "filter[include]": "employee",
          "filter[order]": (orderBy == "" ? "createdAt" : orderBy) + " " + (order ? "asc" : "desc"),
          ...(this.state.dateRange != null
            ? {
                "filter[where][createdAt][between][0]": startOfDay,
                "filter[where][createdAt][between][1]": endOfDay,
              }
            : {}),
          ...(this.props.user.data.defaultEmployeeId != null
            ? {
                "filter[where][employeeId]": this.props.user.data.defaultEmployeeId,
              }
            : {}),
        },
      },
    );

    this.setState({
      allData: res.data.rows,
      spinner: false,
    });
  };

  getSearchData = async () => {
    const res = await Promise.all([axios.get("/employees?filter[order]=employeeName%20asc"), axios.get("/department")]);

    this.setState({
      employeeData: res[0].data.rows,
      departmentData: res[1].data.rows,
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
          <React.Fragment>
            <div className="mb-24 m-12">
              <AccordionSearch onClearSearch={this.handleClear} onSearch={this.handleSearching}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id="dateRange"
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

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Departemen</InputLabel>
                      <Select
                        value={[this.state.data.departmentId]}
                        onChange={this.handleInputChangeDepartment}
                        label="Departmen"
                      >
                        <MenuItem value="">None</MenuItem>
                        {this.state.departmentData.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item.departmentId}>
                              {item.departmentName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      value={this.state.data.employee}
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

            <Dialog
              fullWidth
              maxWidth="xs"
              open={this.state.openImage}
              onClose={() =>
                this.setState({
                  openImage: false,
                  rowDetail: null,
                })
              }
            >
              <DialogTitle>
                {this.state.rowDetail?.employee?.employeeName}
                &nbsp;({this.state.rowDetail?.employeeId}) &nbsp;
                <Typography variant="body1" component="span">
                  {this.state.rowDetail != null && moment(this.state.rowDetail.createdAt).format("L LTS")}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <div className="flex justify-center mt-12">
                  <img alt="Photo" src={this.state.rowDetail?.attendanceImage} />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() =>
                    this.setState({
                      openImage: false,
                      rowDetail: null,
                    })
                  }
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  onClick={async () => {
                    this.setState({
                      openImage: false,
                    });
                    const status = this.state.rowDetail?.isApproved;
                    await this.handleUpdateRow(!status);
                  }}
                >
                  {this.state.rowDetail?.isApproved ? "Batalkan" : "Setuju"}
                  &nbsp; Kehadiran
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
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

import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import { ReportEmployeeTableSelection } from "../ReportEmployeeTableSelection";
import { statusReportConfig } from "./Config";
import { FuseLoading, FusePageCarded, SelectFormsy } from "@fuse";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Slide,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { createData, updateData } from "@mid/store/model/action.model";
import { Employee } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { RootState } from "app/store";
import axios from "axios";
import Formsy from "formsy-react";
import moment from "moment";
import React, { Component } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import Swal from "sweetalert2/dist/sweetalert2.js";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  reportColumn: { title: string; field: string }[];
  reportData: any[];
  showReport: boolean;
  success: boolean;
  redirect: boolean;
  loading: boolean;
  data: {
    startDate: moment.Moment;
    endDate: moment.Moment;
    departmentId: string;
  };
  departmentData: any[];
  isFormValid: boolean;
  selectedEmployees: Employee[];
}

const styles = (theme: Theme) => ({
  layoutRoot: {},
});

class StatusReport extends Component<Props, States> {
  state: States = {
    reportColumn: [
      { title: "Hari", field: "dateString" },
      { title: "Tanggal", field: "date" },
      { title: "Status", field: "status" },
    ],
    reportData: [],
    showReport: false,
    success: false,
    redirect: false,
    loading: false,
    data: {
      startDate: moment(new Date()).startOf("month"),
      endDate: moment(new Date()).endOf("month"),
      departmentId: "",
    },
    departmentData: [],
    isFormValid: true,
    selectedEmployees: [],
  };

  disableButton = () => {
    this.setState({
      isFormValid: false,
    });
  };

  enableButton = () => {
    this.setState({
      isFormValid: true,
    });
  };

  handleInputChange = (event: any, value?: any, name?: string) => {
    value ??= event.target.value;
    name ??= event.target.name;

    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        [name!]: value,
      },
    }));
  };

  handleInputChangeDepartment = (event, target) => {
    const nama = event.target.name;
    const value = event.target.value;
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        departmentId: value,
      },
    }));
  };

  getSelectData = async () => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
        : "";

    const res = await axios.get(`/Department?filter[order]=departmentName ASC${filterDefaultOrganization}`);

    this.setState({
      departmentData: res.data.rows,
      loading: false,
    });
  };

  handleSubmit = () => {
    this.setState({
      loading: false,
    });
    const startDate = moment(this.state.data.startDate, "YYYY-MM-DD").startOf("days").format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment(this.state.data.endDate, "YYYY-MM-DD").endOf("days").format("YYYY-MM-DD HH:mm:ss");
    const employees =
      this.state.selectedEmployees.length > 0 ? this.state.selectedEmployees.map((item) => item.employeeId) : undefined;
    const departmentId = this.state.data.departmentId == "" ? undefined : this.state.data.departmentId;
    axios
      .get(`/${statusReportConfig.endPoint}`, {
        params: {
          startDate,
          endDate,
          employees,
          departmentId,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            showReport: true,
            reportData: res.data,
            loading: false,
          });
        }
      })
      .catch(async (err) => {
        console.error("StatusReport", err);
        this.setState({
          loading: false,
        });
        await Swal.fire("Error", err?.response?.data.message, "error");
      });
  };

  componentDidMount() {
    void this.getSelectData();
  }

  render() {
    const href = window.location.pathname.split("/");
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
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
            <h2>{title2 + " " + t(href[3])}</h2>
          </div>
        }
        content={
          <React.Fragment>
            <Formsy
              onValidSubmit={this.handleSubmit}
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              className="flex flex-col justify-center w-full"
            >
              <div className="m-16">
                <Typography color="textPrimary" style={{ marginBottom: "2%" }}>
                  Pencarian
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      fullWidth
                      variant="inline"
                      inputVariant="outlined"
                      label="Start Date"
                      format="DD/MM/yyyy"
                      value={this.state.data.startDate}
                      onChange={(date) => this.handleInputChange(null, date, "startDate")}
                      maxDate={this.state.data.endDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      fullWidth
                      variant="inline"
                      inputVariant="outlined"
                      label="End Date"
                      format="DD/MM/yyyy"
                      value={this.state.data.endDate}
                      onChange={(date) => this.handleInputChange(null, date, "endDate")}
                      minDate={this.state.data.startDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SelectFormsy
                      name="departmentId"
                      label="Pilih Departemen"
                      value={this.state.data.departmentId}
                      variant="outlined"
                      onChange={this.handleInputChangeDepartment}
                    >
                      <MenuItem value="">Semua</MenuItem>
                      {this.state.departmentData.map((item, index) => (
                        <MenuItem key={index} value={item.departmentId}>
                          {item.departmentName}
                        </MenuItem>
                      ))}
                    </SelectFormsy>
                  </Grid>
                </Grid>
                <div className="h-24" />
                <ReportEmployeeTableSelection
                  selectedEmployees={this.state.selectedEmployees}
                  setParentState={(...args) => this.setState(...args)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "2%" }}
                  onClick={() => this.handleSubmit()}
                >
                  Lihat
                </Button>
              </div>
            </Formsy>
            <Dialog
              TransitionComponent={Slide}
              open={this.state.showReport}
              onClose={() => {
                this.setState({
                  showReport: false,
                });
              }}
              scroll="paper"
              fullScreen
            >
              <DialogContent dividers>
                <div className="flex justify-center">
                  <table id="table-to-xls">
                    {this.state.reportData.map((reportData, i) => (
                      <React.Fragment key={i}>
                        <table className="border-collapse border-2 border-gray-500">
                          <thead>
                            <tr>
                              <th
                                className="border border-gray-400 px-4 py-2 text-gray-800"
                                colSpan={this.state.reportColumn.length}
                                align="center"
                              >
                                STATUS REPORT
                              </th>
                            </tr>
                            <tr>
                              <td colSpan={this.state.reportColumn.length} align="center">
                                {moment(this.state.data.startDate, "YYYY-MM-DD").format("L")}-
                                {moment(this.state.data.endDate, "YYYY-MM-DD").format("L")}
                              </td>
                            </tr>
                            <tr>
                              <td align="right">Nama: </td>
                              <th colSpan={this.state.reportColumn.length - 1} align="left">
                                {reportData.employeeName}
                              </th>
                            </tr>
                            <tr>
                              <td align="right">NIK: </td>
                              <th colSpan={this.state.reportColumn.length - 1} align="left">
                                {reportData.employeeId}
                              </th>
                            </tr>
                            <tr>
                              {this.state.reportColumn.map((column, i) => (
                                <th className="border border-gray-400 px-4 py-2 text-gray-800" align="center" key={i}>
                                  {column.title}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.statusList.map((statusList, i) => (
                              <tr key={i}>
                                <td className="border border-gray-400 px-4 py-1" height={20}>
                                  {moment(statusList.date, "L").format("dddd")}
                                </td>
                                <td className="border border-gray-400 px-4 py-1">{statusList.date}</td>
                                <td className="border border-gray-400 px-4 py-1">
                                  {statusList.activity.toUpperCase()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <tr>
                          <td colSpan={this.state.reportColumn.length}>&nbsp;</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </table>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  component={ReactHTMLTableToExcel}
                  table="table-to-xls"
                  filename={`STATUS_REPORT_PRINT_AT_${moment().format("DDMMYYYY")}`}
                  sheet="Sheet1"
                  buttonText="Export XLS"
                />
                <Button
                  onClick={() => {
                    this.setState({
                      showReport: false,
                    });
                  }}
                >
                  Batal
                </Button>
                {/* <Button onClick={() => this.handleApprove()}>Simpan</Button> */}
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
  createData,
  updateData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(StatusReport)));

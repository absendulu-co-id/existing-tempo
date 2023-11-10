import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import { ReportEmployeeTableSelection } from "../ReportEmployeeTableSelection";
import { recapitulationReportConfig } from "./Config";
import { FieldData } from "./FieldData";
import { FuseLoading, FusePageCarded } from "@fuse";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { WithStyles } from "@material-ui/styles";
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
  reportData: any[];
  showReport: boolean;
  success: boolean;
  redirect: boolean;
  loading: boolean;
  data: any;
  departmentData: any[];
  isFormValid: boolean;
  selectedEmployees: Employee[];
}

const styles = (theme: Theme) => ({
  layoutRoot: {},
});

class RecapitulationReport extends Component<Props, States> {
  state: States = {
    reportData: [],
    showReport: false,
    success: false,
    redirect: false,
    loading: false,
    data: {},
    departmentData: [],
    isFormValid: false,
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

  handleFormField = async (itemData) => {
    const data = {};
    await this.getSelectData();
    if (itemData !== undefined) {
      this.setState({
        data: itemData,
      });
    } else {
      FieldData.map((item, index) => {
        return (data[item.name] = item.value);
      });
      this.setState({
        data,
      });
    }
  };

  handleInputChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    if (name === "startDate") {
      value = moment(value).startOf("days");
    } else if (name === "endDate") {
      value = moment(value).endOf("days");
    }
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        [name]: value,
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
        departmentName: this.state.departmentData.find((x) => x.departmentId == value).departmentName,
      },
    }));
  };

  getSelectData = async () => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
        : "";
    await axios.get(`/Department?filter[order]=departmentName ASC${filterDefaultOrganization}`).then((res) => {
      this.setState({
        departmentData: res.data.rows,
        loading: false,
      });
    });
  };

  handleSubmit = () => {
    this.setState({
      loading: true,
    });

    const startDate = moment(this.state.data.startDate, "YYYY-MM-DD").startOf("days").format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment(this.state.data.endDate, "YYYY-MM-DD").endOf("days").format("YYYY-MM-DD HH:mm:ss");
    const employees =
      this.state.selectedEmployees.length > 0 ? this.state.selectedEmployees.map((item) => item.employeeId) : undefined;
    const departmentId = this.state.data ? this.state.data.departmentId : undefined;

    axios
      .get(`/${recapitulationReportConfig.endPoint}`, {
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
        console.error("RecapitulationReport", err);
        this.setState({
          loading: false,
        });
        await Swal.fire("Error", err?.response?.data.message, "error");
      });
  };

  async componentDidMount() {
    await this.handleFormField(undefined);
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
              className="w-full"
            >
              <div className="m-16">
                <Typography color="textPrimary" style={{ marginBottom: "2%" }}>
                  Pencarian
                </Typography>
                <Grid container spacing={2}>
                  {FieldData.map((item, index) => {
                    if (item.name === "departmentId") {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel>{item.label}</InputLabel>
                            <Select
                              fullWidth
                              labelWidth={item.label.length * 8}
                              name={item.name}
                              value={this.state.data[item.name] || ""}
                              variant="outlined"
                              onChange={this.handleInputChangeDepartment}
                            >
                              {this.state.departmentData.map((subItem, subIndex) => {
                                return (
                                  <MenuItem key={subIndex} value={subItem.departmentId}>
                                    {subItem.departmentName}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                      );
                    }

                    if ((item.type === "text" || item.type === "date") && item.search === true) {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            type={item.type}
                            name={item.name}
                            label={item.label}
                            onChange={this.handleInputChange}
                            multiline={item.multiline}
                            minRows={item.rows}
                            maxRows={item.rowsMax}
                            value={
                              item.type === "date"
                                ? moment(this.state.data[item.name]).format("YYYY-MM-DD")
                                : this.state.data[item.name]
                            }
                            InputLabelProps={{
                              shrink: item.type === "date" ? true : undefined,
                            }}
                            inputProps={{
                              min:
                                this.state.data?.startDate && item.name === "endDate"
                                  ? moment(this.state.data.startDate).format("YYYY-MM-DD")
                                  : null,
                              max:
                                this.state.data?.startDate && item.name === "startDate"
                                  ? moment(this.state.data.endDate).format("YYYY-MM-DD")
                                  : null,
                            }}
                          />
                        </Grid>
                      );
                    } else if (item.type === "select" && item.search === true) {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel shrink>{item.label}</InputLabel>
                            <Select
                              labelWidth={item.label.length * 8}
                              name={item.name}
                              value={
                                typeof this.state.data[item.name] !== "undefined" ? [this.state.data[item.name]] : ""
                              }
                              variant="outlined"
                              onChange={this.handleInputChange}
                            >
                              {item.option?.map((subItem, subIndex) => (
                                <MenuItem key={subIndex} value={subItem.value}>
                                  {subItem.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      );
                    }

                    return "";
                  })}
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
                  <table className="border-collapse border-2 border-gray-500" id="table-to-xls">
                    <thead>
                      <tr>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" colSpan={12} align="center">
                          REKAPITULASI REPORT
                          <br />
                          {moment(this.state.data.startDate, "YYYY-MM-DD").format("L")}-
                          {moment(this.state.data.endDate, "YYYY-MM-DD").format("L")}
                          {this.state.data?.departmentId != null && (
                            <React.Fragment>
                              <br />
                              <tr>
                                <td colSpan={11} align="center">
                                  Department : {this.state.data.departmentName}
                                </td>
                              </tr>
                            </React.Fragment>
                          )}
                        </th>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Employee ID
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Employee Name
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Working Day
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Non Working Day
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" colSpan={2}>
                          Attendance
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Absence
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Leave
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Clock In Early
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Clock In Late
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Clock Out Early
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800" rowSpan={2}>
                          Clock Out Late
                        </th>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800">Work Day</th>
                        <th className="border border-gray-400 px-4 py-2 text-gray-800">Non Work Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.reportData.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-400 px-4 py-1">{item.employeeId}</td>
                          <td className="border border-gray-400 px-4 py-1">{item.employeeName}</td>
                          <td className="border border-gray-400 px-4 py-1">{item.workingDay}</td>
                          <td className="border border-gray-400 px-4 py-1">{item.nonWorkingDay}</td>
                          <td className="border border-gray-400 px-4 py-1">{item.attendanceWorkingDay}</td>
                          <td className="border border-gray-400 px-4 py-1">{item.nonAttendanceWorkingDay}</td>
                          <td className="border border-gray-400 px-4 py-1">{item.absent}</td>
                          <td className="border border-gray-400 px-4 py-1">{item.leave}</td>
                          <td className="border border-gray-400 px-4 py-1">
                            {item.checkInEarly == "00:00:00" ? "-" : item.checkInEarly}
                          </td>
                          <td className="border border-gray-400 px-4 py-1">
                            {item.checkInLate == "00:00:00" ? "-" : item.checkInLate}
                          </td>
                          <td className="border border-gray-400 px-4 py-1">
                            {item.checkOutEarly == "00:00:00" ? "-" : item.checkOutEarly}
                          </td>
                          <td className="border border-gray-400 px-4 py-1">
                            {item.checkOutLate == "00:00:00" ? "-" : item.checkOutLate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  component={ReactHTMLTableToExcel}
                  table="table-to-xls"
                  filename={`RECAPITULATION_REPORT_PRINT_AT_${moment().format("DDMMYYYY")}`}
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

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(RecapitulationReport)));

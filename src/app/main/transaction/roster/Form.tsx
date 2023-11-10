import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import { ReportEmployeeTableSelection } from "../ReportEmployeeTableSelection";
import { employeeRosterReportConfig } from "./Config";
import { FieldData } from "./FieldData";
import { FuseLoading, FusePageCarded, SelectFormsy } from "@fuse";
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
  withStyles,
} from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import { createData, updateData } from "@mid/store/model/action.model";
import { Employee } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
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
  columnDate: any[];
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

class RosterReport extends Component<Props, States> {
  state: States = {
    columnDate: [],
    reportData: [],
    showReport: false,
    success: false,
    redirect: false,
    loading: false,
    data: [],
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

  handleFormField = async (itemData?: any) => {
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
    await axios
      .all([
        axios.get(`/Department?filter[order]=departmentName ASC${filterDefaultOrganization}`).then((res) => {
          this.setState({
            departmentData: res.data.rows,
          });
        }),
      ])
      .then((res) => {
        this.setState({
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
    const data = {
      startDate,
      endDate,
      employees:
        this.state.selectedEmployees.length > 0
          ? this.state.selectedEmployees.map((item) => item.employeeId)
          : this.props.user.data.userType === "employee"
          ? [this.props.user.data.defaultEmployeeId]
          : undefined,
      departmentId: this.state.data
        ? this.state.data.departmentId
          ? this.state.data.departmentId
          : undefined
        : undefined,
    };
    axios
      .get(`/${employeeRosterReportConfig.endPoint}`, { params: data })
      .then((res) => {
        if (res.status === 200) {
          const columnDate =
            res.data.length > 0 ? Object.keys(res.data[0]).filter((itemFilter) => itemFilter.includes("-")) : [];
          this.setState({
            columnDate,
            showReport: true,
            reportData: res.data,
            loading: false,
          });
        }
      })
      .catch(async (err) => {
        this.setState({
          loading: false,
        });
        if (err.response.data) {
          await Swal.fire("Error", err.response.data.message, "error");
        }
      });
  };

  async componentDidMount() {
    this.setState({ loading: false });
    await this.handleFormField();
  }

  render() {
    const href = window.location.pathname.split("/");
    const { classes, t, user } = this.props;
    const { redirect, loading } = this.state;
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;

    if (redirect) {
      return <Redirect to="/login" />;
    } else if (loading) {
      return <FuseLoading />;
    }

    const startDate = moment(this.state.data.startDate, "YYYY-MM-DD");
    const endDate = moment(this.state.data.endDate, "YYYY-MM-DD");

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
                            rows={item.rows}
                            rowsMax={item.rowsMax}
                            value={
                              item.type === "date"
                                ? moment(this.state.data[item.name]).format("YYYY-MM-DD")
                                : this.state.data[item.name]
                            }
                            InputLabelProps={{
                              shrink: item.type === "date" ? true : undefined,
                            }}
                            inputProps={{
                              min: this.state.data
                                ? this.state.data.startDate
                                  ? item.name === "endDate"
                                    ? moment(this.state.data.startDate).format("YYYY-MM-DD")
                                    : null
                                  : null
                                : null,
                              max: this.state.data
                                ? this.state.data.startDate
                                  ? item.name === "startDate"
                                    ? moment(this.state.data.endDate).format("YYYY-MM-DD")
                                    : null
                                  : null
                                : null,
                            }}
                          />
                        </Grid>
                      );
                    } else if (item.type === "select" && item.search === true) {
                      if (item.option !== null) {
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
                                {item.option?.map((subItem, subIndex) => {
                                  return (
                                    <MenuItem key={subIndex} value={subItem.value}>
                                      {subItem.label}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Grid>
                        );
                      } else {
                        if (item.name === "departmentId") {
                          if (user.data.userType !== "employee") {
                            return (
                              <Grid item xs={12} sm={6} key={index}>
                                <SelectFormsy
                                  name={item.name}
                                  label={`Pilih ${item.label}`}
                                  value={this.state.data[item.name] || ""}
                                  variant="outlined"
                                  onChange={this.handleInputChangeDepartment}
                                  required
                                >
                                  {this.state.departmentData.map((item, index) => {
                                    return (
                                      <MenuItem key={index} value={item.departmentId}>
                                        {item.departmentName}
                                      </MenuItem>
                                    );
                                  })}
                                </SelectFormsy>
                              </Grid>
                            );
                          }
                        } else {
                          return "";
                        }
                      }
                    } else {
                      return "";
                    }
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
                <table className="border-collapse border-2 border-gray-500 w-full" id="table-to-xls">
                  <thead>
                    <tr>
                      <th
                        className="border border-gray-400 px-4 py-2 text-gray-800"
                        colSpan={this.state.columnDate.length + 2}
                        align="center"
                      >
                        ROSTER REPORT
                        <br />
                        {startDate.format("L")} - {endDate.format("L")}
                      </th>
                    </tr>
                    {this.state.data?.departmentId != null && (
                      <tr>
                        <th colSpan={2 + this.state.columnDate.length}>
                          Department : {this.state.data.departmentName}
                        </th>
                      </tr>
                    )}
                    <tr>
                      <th className="border border-gray-400 px-4 py-2 whitespace-no-wrap">Employee ID</th>
                      <th className="border border-gray-400 px-4 py-2 whitespace-no-wrap">Employee Name</th>
                      {this.state.columnDate.map((date1, i) => {
                        const date = moment(date1, "DD-MM-YYYY");

                        return (
                          <th className="border border-gray-400 px-4 py-2 whitespace-no-wrap" align="center" key={i}>
                            {startDate.isSame(endDate, "month") ? date.format("DD") : date.format("L")}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.reportData.map((item, index) => (
                      <tr key={index}>
                        <th className="border border-gray-400 px-4 py-1 whitespace-no-wrap">{item.employeeId}</th>
                        <th className="border border-gray-400 px-4 py-1 whitespace-no-wrap">{item.employeeName}</th>
                        {this.state.columnDate.map((subItem, subIndex) => (
                          <td
                            className="border border-gray-400 px-4 py-1 whitespace-no-wrap"
                            align="center"
                            key={subIndex}
                          >
                            {item[subItem] ? item[subItem] : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  component={ReactHTMLTableToExcel}
                  table="table-to-xls"
                  filename={`ROSTER_REPORT_PRINT_AT_${moment().format("DDMMYYYY")}`}
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

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  setNavigation: Actions.setNavigation,
  setUser: AuthActions.setUser,
  createData,
  updateData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(RosterReport)));

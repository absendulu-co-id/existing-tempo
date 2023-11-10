import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import { ReportEmployeeTableSelection } from "../../transaction/ReportEmployeeTableSelection";
import { FieldData } from "./FieldData";
import { FuseLoading, FusePageCarded, SelectFormsy } from "@fuse";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Department, Employee } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import axios from "axios";
import Formsy from "formsy-react";
import moment from "moment";
import { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import swal from "sweetalert";

const styles = (theme) => ({
  layoutRoot: {},
});

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  success: boolean;
  redirect: boolean;
  loading: boolean;
  loadingTable: boolean;
  data: any;
  departmentData: Department[];
  isFormValid: boolean;
  selectedEmployees: Employee[];
}

class Process extends Component<Props, States> {
  state: States = {
    success: false,
    redirect: false,
    loading: false,
    loadingTable: false,
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

  handleFormField = async () => {
    const data = {};
    await this.getSelectData();
    FieldData.map((item, index) => {
      return (data[item.name] = item.value);
    });
    this.setState({
      data,
    });
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

  handleInputChangeDepartment = (event, target) => {
    const index = this.state.departmentData.findIndex((item) => item.departmentId == event.target.value);
    if (target) {
      if (target.action === "clear") {
        this.setState((prevState) => {
          const data = prevState.data;
          delete data.departmentId;
          delete data.departmentName;
          return { data };
        });
      } else {
        this.setState((prevState) => ({
          data: {
            ...prevState.data,
            departmentName: prevState.departmentData[index].departmentName,
            departmentId: prevState.departmentData[index].departmentId,
          },
        }));
      }
    } else {
      this.setState((prevState) => ({
        data: {
          ...prevState.data,
          departmentName: prevState.departmentData[index].departmentName,
          departmentId: prevState.departmentData[index].departmentId,
        },
      }));
    }
  };

  getSelectData = async () => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? this.props.user.data.defaultOrganizationAccess
          ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
          : ""
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
          loading: !this.state.loading,
        });
      });
  };

  handleSubmit = async () => {
    this.setState({
      loading: !this.state.loading,
    });
    const startDate = moment(this.state.data.startDate, "YYYY-MM-DD").startOf("days").format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment(this.state.data.endDate, "YYYY-MM-DD").endOf("days").format("YYYY-MM-DD HH:mm:ss");
    const employees =
      this.state.selectedEmployees.length > 0 ? this.state.selectedEmployees.map((item) => item.employeeId) : undefined;
    const departmentId = this.state.data ? this.state.data.departmentId : undefined;

    try {
      const res = await axios.post("/Process-Roster", {
        startDate,
        endDate,
        employees,
        departmentId,
      });

      if (res.status === 200) {
        await swal("Sukses!", "Data berhasil dikalkulasi!", "success");
        this.setState({ loading: false });
        await this.componentDidMount();
      }
    } catch (err: any) {
      this.setState({ loading: false });
      await swal("Error", err?.response?.data.message, "error");
    }
  };

  async componentDidMount() {
    this.setState({ loading: !this.state.loading });
    await this.handleFormField();
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
          <Formsy
            onValidSubmit={this.handleSubmit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            className="flex flex-col justify-center w-full"
          >
            <div className="p-24">
              <Typography color="textPrimary" style={{ marginBottom: "2%" }}>
                Pencarian
              </Typography>
              <Grid container spacing={2}>
                {FieldData.map((item, index) => {
                  if ((item.type === "text" || item.type === "date") && item.search) {
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
                          minRows={item.minRows ?? item.rows}
                          maxRows={item.maxRows ?? item.rows}
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
                  } else if (item.type === "select" && item.search) {
                    if (item.option != null) {
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
                              {item.option.map((subItem, subIndex) => {
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
                        return (
                          <Grid item xs={12} sm={6} key={index}>
                            <SelectFormsy
                              name={item.name}
                              label={item.label}
                              value={[this.state.data[item.name]]}
                              validations={item.validations}
                              validationErrors={item.validationErrors}
                              variant="outlined"
                              onChange={this.handleInputChangeDepartment}
                              required={item.required}
                            >
                              <MenuItem value="" disabled>
                                {"Pilih " + item.label}
                              </MenuItem>
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
                {" "}
                Simpan{" "}
              </Button>
            </div>
          </Formsy>
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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(Process)));

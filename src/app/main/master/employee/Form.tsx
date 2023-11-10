import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { employeeConfig } from "./Config";
import { FieldData, tabFieldData } from "./FieldData";
import { DateFormsy, FuseLoading, FusePageCarded, SelectFormsy, TextFieldFormsy } from "@fuse";
import { formsyErrorMessage } from "@fuse/components/formsy/FormsyErrorMessage";
import { Icon } from "@iconify-icon/react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Grid,
  InputAdornment,
  ListItemText,
  ListSubheader,
  MenuItem,
  Tab,
  Tabs,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Styles } from "@material-ui/styles";
import { createData, updateData } from "@mid/store/model/action.model";
import {
  Area,
  Department,
  Employee,
  Employeetype,
  Organization,
  Position,
  Workflowrole,
} from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { RootState } from "app/store";
import axios from "axios";
import Formsy from "formsy-react";
import moment from "moment";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends WithTranslation, WithStyles<typeof styles, true>, PropsFromRedux {}

interface States {
  success: boolean;
  redirect: boolean;
  loading: boolean;
  data?: Partial<Employee>;
  areaData: Area[];
  employeeData: Employee[];
  employeeTypeData: Employeetype[];
  departmentData: Department[];
  positionData: Position[];
  organizationData: Organization[];
  workflowRoleData: Workflowrole[];
  primaryKey: "employeeId";
  primaryKeyId?: string;
  value: number;
  tabValue: number;
  isFormValid: boolean;
}

const styles: Styles<Theme, Props> = (theme: Theme) => ({
  layoutRoot: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  cardActionRight: {
    marginLeft: "auto",
  },
});

class Form extends Component<Props, States> {
  state: States = {
    success: false,
    redirect: false,
    loading: true,
    data: {},
    areaData: [],
    employeeData: [],
    employeeTypeData: [],
    departmentData: [],
    positionData: [],
    organizationData: [],
    workflowRoleData: [],
    primaryKey: "employeeId",
    value: 0,
    tabValue: 0,
    isFormValid: true,
  };

  handleFormField = async (itemData?: Employee) => {
    const data = {};
    await this.getSelectData();

    if (itemData != null) {
      if (itemData.workflowRoleId) {
        const filterWorkflowRole = this.state.workflowRoleData.find(
          (x) => x.workflowRoleId === itemData.workflowRoleId,
        );
        if (filterWorkflowRole != null) {
          itemData.workflowRole = filterWorkflowRole;
          (itemData as any).workflowRoleName = filterWorkflowRole.workflowRoleName;
        }
      }
      this.setState({
        data: itemData,
        loading: false,
      });

      return;
    }

    FieldData.forEach((item) => (data[item.name] = item.value));

    tabFieldData.forEach((item) => item.fieldData.forEach((subItem) => (data[subItem.name] = subItem.value)));

    this.setState({
      data: data as any,
      loading: false,
    });
  };

  handleInputChange = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name == null) throw new Error("handleInputChange: name cannot be null");

    this.setState((prevState) => ({
      data: {
        ...(prevState.data as any),
        [name]: value,
      },
    }));
  };

  handleInputChangeNotifiedEmployee = (event: React.ChangeEvent<any>, newValue?: any, fieldName?: string) => {
    let notifiedEmployee = event.target.value
      .map((x) => {
        if (x == null) return null;
        const employee = this.state.employeeData.find((y) => y.employeeId == x);
        return employee;
      })
      .filter((x) => x != null);

    if (notifiedEmployee.length == 0) {
      notifiedEmployee = [{ employeeId: -1 }] as any;
    }

    this.setState((prevState) => ({
      data: {
        ...(prevState.data as any),
        employeeNotifiedIdEmployees: notifiedEmployee,
      },
    }));
  };

  handleInputChangeEmployeeType = (event: React.ChangeEvent<{ value: unknown }>) => {
    const index = this.state.employeeTypeData.findIndex((item) => item.employeeTypeId == event.target.value);
    this.setState((prevState) => ({
      data: {
        ...(prevState.data as any),
        employeeTypeName: prevState.employeeTypeData[index].employeeTypeName,
        employeeTypeId: prevState.employeeTypeData[index].employeeTypeId,
      },
    }));
  };

  handleInputChangeArea = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
    newValue?: any,
    fieldName?: string,
  ) => {
    const value = event.target.value as any[];

    if (value[value.length - 1] === "_all") {
      this.setState((prevState) => ({
        data: {
          ...(prevState.data as any),
          areaIdAreas:
            prevState.data?.areaIdAreas?.length === prevState.areaData.length ? [{ areaId: -1 }] : prevState.areaData,
        },
      }));
      return;
    }

    let employeeArea = value
      .map((x) => {
        if (x == null) return null;
        const area = this.state.areaData.find((y) => y.areaId == x);
        return area;
      })
      .filter((x) => x != null);

    if (employeeArea.length == 0) {
      employeeArea = [{ areaId: -1 }] as any;
    }

    this.setState((prevState) => ({
      data: {
        ...(prevState.data as any),
        areaIdAreas: employeeArea,
      },
    }));
  };

  handleInputChangePosition = (event: React.ChangeEvent<{ value: unknown }>) => {
    const index = this.state.positionData.findIndex((item) => item.positionId == event.target.value);
    this.setState((prevState) => ({
      data: {
        ...(prevState.data as any),
        positionName: prevState.positionData[index].positionName,
        positionId: prevState.positionData[index].positionId,
      },
    }));
  };

  handleInputChangeDepartment = (event: React.ChangeEvent<{ value: unknown }>) => {
    const index = this.state.departmentData.findIndex((item) => item.departmentId == event.target.value);
    this.setState((prevState) => ({
      data: {
        ...(prevState.data as any),
        departmentName: prevState.departmentData[index].departmentName,
        departmentId: prevState.departmentData[index].departmentId,
      },
    }));
  };

  // handleInputChangeOrganization = (event: React.ChangeEvent<{ value: unknown }>) => {
  //   this.setState((prevState) => ({
  //     data: {
  //       ...(prevState.data) as any,
  //       organizationId: event.organizationId,
  //       organizationName: event.organizationName,
  //     },
  //   }));
  // };

  handleInputChangeWorkflowRole = (event: React.ChangeEvent<{ value: unknown }>) => {
    const index = this.state.workflowRoleData.findIndex((item) => item.workflowRoleId == event.target.value);
    this.setState((prevState) => ({
      data: {
        ...(prevState.data as any),
        workflowRoleName: prevState.workflowRoleData[index].workflowRoleName,
        workflowRoleId: prevState.workflowRoleData[index].workflowRoleId,
      },
    }));
  };

  handleSubmit = async () => {
    const href = window.location.pathname.split("/");
    this.setState({
      loading: true,
    });

    const data = {
      ...this.state.data,
      organizationId:
        this.props.user.data.userType !== "mid-admin"
          ? `${this.props.user.data.defaultOrganizationAccess.organizationId}`
          : this.state.data?.organizationId,
      organizationName:
        this.props.user.data.userType !== "mid-admin"
          ? `${this.props.user.data.defaultOrganizationAccess.organizationName}`
          : this.state.data?.organizationName,
    };

    if (data.areaIdAreas != null && data.areaIdAreas.length == 1 && data.areaIdAreas[0].areaId == -1) {
      data.areaIdAreas = [];
    }
    data.areaIdAreas = data.areaIdAreas?.map((x) => {
      return { areaId: x.areaId };
    }) as any;
    data.employeeNotifiedIdEmployees = data.employeeNotifiedIdEmployees?.map((x) => {
      return { employeeId: x.employeeId };
    }) as any;

    if (href[3] === "add") {
      await this.props.createData(employeeConfig.endPoint, data);
    } else if (href[3] === "edit") {
      await this.props.updateData(employeeConfig.endPoint, data, this.state.primaryKeyId!);
    }
    this.setState({
      loading: false,
    });
  };

  getSelectData = async () => {
    try {
      const userData = this.props.user.data;
      const filterDefaultOrganization =
        userData.userType !== "mid-admin" && userData.defaultOrganizationAccess != null
          ? `&filter[where][organizationId]=${userData.defaultOrganizationAccess.organizationId}`
          : "";

      const urls = [
        `/Area?filter[order]=areaName%20asc${filterDefaultOrganization}`,
        `/Department?filter[order]=departmentName%20asc${filterDefaultOrganization}`,
        `/Position?filter[order]=positionName%20asc${filterDefaultOrganization}`,
        "/EmployeeType?filter[order]=employeeTypeName%20asc",
        `/Organizations?filter[order]=organizationName%20asc${filterDefaultOrganization}`,
        `/WorkflowRole?filter[order]=workflowRoleName%20asc${filterDefaultOrganization}`,
        `/Employees?filter[order]=employeeName%20asc${filterDefaultOrganization}`,
      ];

      const res = await Promise.all(urls.map(async (url) => await axios.get(url)));

      this.setState({
        areaData: res[0].data.rows,
        departmentData: res[1].data.rows,
        positionData: res[2].data.rows,
        employeeTypeData: res[3].data.rows,
        organizationData: res[4].data.rows,
        workflowRoleData: res[5].data.rows,
        employeeData: res[6].data.rows,
      });
    } catch (error: any) {
      await Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
      });
      throw new Error(error);
    }
  };

  async componentDidMount() {
    const { addRule, editRule } = this.props.access;
    if (!editRule || !addRule) {
      await Swal.fire({
        title: "Error",
        text: "Maaf, Anda tidak memiliki akses",
        icon: "error",
      });
      history.goBack();
    }

    const href = window.location.pathname.split("/");

    if (href[3] === "edit") {
      const id = href[4];
      this.setState({ primaryKeyId: id });
      const res = await axios.get<Employee>(`/employees/${id}`).catch(async (err) => {
        await Swal.fire({
          title: "Error",
          text: err,
          icon: "error",
        });
      });
      if (res != null) {
        await this.handleFormField(res.data);
      }
    } else {
      await this.handleFormField();
    }
  }

  render() {
    const { classes, model } = this.props;
    const { t } = this.props;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title2}`;
    const title3 = href[3] === "add" ? "Tambah " + title2 : "Ubah " + title2;

    const { redirect, loading } = this.state;

    if (redirect) {
      return <Redirect to="/login" />;
    } else if (loading || model.loading) {
      return <FuseLoading />;
    }

    const notifierEmployees = this.state.employeeData.filter((x) => x.employeeId != this.state.data?.employeeId);

    return (
      <FusePageCarded
        classes={{ root: classes.layoutRoot }}
        header={<HeaderComponent breadcrumbs={[title, title2, title3]} titlePage={title2} />}
        contentToolbar={
          <div className="px-24">
            <h2>
              {href[3] === "add" ? "Tambah" : "Edit"} {title2}
            </h2>
          </div>
        }
        content={
          <div className="p-24">
            <Formsy
              onValidSubmit={this.handleSubmit}
              onValid={() => this.setState({ isFormValid: true })}
              onInvalid={() => this.setState({ isFormValid: false })}
              className="flex flex-col justify-center w-full"
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextFieldFormsy
                    variant="outlined"
                    type="text"
                    name="employeeId"
                    label={"ID Karyawan"}
                    debounce
                    onChange={this.handleInputChange}
                    value={this.state.data!.employeeId}
                    validations="isAlphanumeric"
                    validationErrors={formsyErrorMessage(t, "ID Karyawan")}
                    required
                    disabled={href[3] !== "add"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon icon="mdi:id-card" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextFieldFormsy
                    variant="outlined"
                    type="text"
                    name="employeeName"
                    label={"Nama"}
                    debounce
                    onChange={this.handleInputChange}
                    value={this.state.data!.employeeName}
                    validations="isExisty"
                    validationErrors={formsyErrorMessage(t, "Nama")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon icon="mdi:card-account-details" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextFieldFormsy
                    variant="outlined"
                    type="email"
                    name="email"
                    label={"Email"}
                    debounce
                    onChange={this.handleInputChange}
                    value={this.state.data!.email}
                    validations="isEmail"
                    validationErrors={formsyErrorMessage(t, "Email")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon icon="mdi:email" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateFormsy
                    variant="inline"
                    inputVariant="outlined"
                    name="hireDate"
                    label={"Tanggal Masuk"}
                    value={this.state.data!.hireDate ? moment(this.state.data!.hireDate).toISOString() : ""}
                    onChange={(date, value) =>
                      this.handleInputChange({
                        target: { name: "hireDate", value: date },
                      } as any)
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon icon="mdi:calendar-start" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} className="mt-16">
                <Grid item xs={12} sm={6} md={4}>
                  <SelectFormsy
                    name="employeeTypeId"
                    label="Tipe Karyawan"
                    value={[this.state.data!.employeeTypeId]}
                    variant="outlined"
                    onChange={this.handleInputChangeEmployeeType}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="mdi:pen" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="" disabled>
                      Pilih Tipe Karyawan
                    </MenuItem>
                    {this.state.employeeTypeData.map((x, i) => (
                      <MenuItem key={i} value={x.employeeTypeId}>
                        {x.employeeTypeName}
                      </MenuItem>
                    ))}
                  </SelectFormsy>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SelectFormsy
                    name="departmentId"
                    label={"Departemen"}
                    value={[this.state.data!.departmentId]}
                    variant="outlined"
                    onChange={this.handleInputChangeDepartment}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="fluent:people-team-20-filled" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="" disabled>
                      {"Pilih Departemen"}
                    </MenuItem>
                    {this.state.departmentData.map((x, i) => (
                      <MenuItem key={i} value={x.departmentId}>
                        {x.departmentName}
                      </MenuItem>
                    ))}
                  </SelectFormsy>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SelectFormsy
                    name="positionId"
                    label="Jabatan"
                    value={[this.state.data!.positionId]}
                    variant="outlined"
                    onChange={this.handleInputChangePosition}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="mdi:briefcase" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="" disabled>
                      {"Pilih Jabatan"}
                    </MenuItem>
                    {this.state.positionData.map((x, i) => (
                      <MenuItem key={i} value={x.positionId}>
                        {x.positionName}
                      </MenuItem>
                    ))}
                  </SelectFormsy>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SelectFormsy
                    name="areaIdAreas"
                    label={"Area"}
                    value={this.state.data?.areaIdAreas?.map((x) => x.areaId) ?? [{ areaId: -1 }]}
                    variant="outlined"
                    onChange={this.handleInputChangeArea}
                    multiple
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="mdi:office-building" />
                      </InputAdornment>
                    }
                    renderValue={(value1: unknown): React.ReactNode => {
                      const value = value1 as number[];
                      if ((value.length == 1 && value[0] == -1) || value.length == 0) {
                        return "Pilih Area";
                      }
                      return (
                        <div className={classes.chips}>
                          {value.map((x) => {
                            const areaName = this.state.areaData.find((y) => y.areaId == x)?.areaName;
                            return <Chip key={x} label={areaName} className={classes.chip} />;
                          })}
                        </div>
                      );
                    }}
                  >
                    <MenuItem value="-1" disabled>
                      {"Pilih Area"}
                    </MenuItem>
                    <MenuItem value="_all">
                      <Checkbox
                        color="primary"
                        size="small"
                        checked={
                          this.state.areaData.length > 0 &&
                          this.state.areaData.length === this.state.data?.areaIdAreas?.length
                        }
                        indeterminate={
                          (this.state.data?.areaIdAreas?.length ?? 0) > 0 &&
                          (this.state.data?.areaIdAreas?.length ?? 0) < this.state.areaData.length
                        }
                      />
                      <ListItemText primary={t("select_all", { t: t("area") })} />
                    </MenuItem>
                    {this.state.areaData.map((item) => (
                      <MenuItem key={item.areaId} value={item.areaId}>
                        <Checkbox
                          checked={this.state.data?.areaIdAreas?.some((x) => x.areaId == item.areaId)}
                          color="primary"
                          size="small"
                        />
                        <ListItemText primary={item.areaName} />
                      </MenuItem>
                    ))}
                  </SelectFormsy>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SelectFormsy
                    name="workflowRoleId"
                    label={"Workflow Role"}
                    value={[this.state.data!.workflowRoleId]}
                    variant="outlined"
                    validations="isExisty"
                    validationErrors={formsyErrorMessage(t, "Workflow Role")}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="mdi:shield-user" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="" disabled>
                      {"Pilih Workflow Role"}
                    </MenuItem>
                    {this.state.workflowRoleData.map((x, i) => (
                      <MenuItem key={i} value={x.workflowRoleId}>
                        {x.workflowRoleName}
                      </MenuItem>
                    ))}
                  </SelectFormsy>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SelectFormsy
                    name="employeeNotifiedIdEmployees"
                    label={"Notified Employee"}
                    value={this.state.data?.employeeNotifiedIdEmployees?.map((x) => x.employeeId) ?? ["-1"]}
                    validations="isExisty"
                    validationErrors={formsyErrorMessage(t, "Notified Employee")}
                    variant="outlined"
                    onChange={this.handleInputChangeNotifiedEmployee}
                    multiple
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon icon="mdi:bell" />
                      </InputAdornment>
                    }
                    renderValue={(value1): React.ReactNode => {
                      let value = value1 as string[];
                      value = value.filter((x) => x != null);
                      if ((value.length == 1 && value[0] == "-1") || value.length == 0) {
                        return "Pilih Notified Employee";
                      }
                      return (
                        <div className={classes.chips}>
                          {value.map((x) => {
                            const employee = notifierEmployees.find((y) => y.employeeId == x);
                            return (
                              <Chip
                                key={x}
                                label={`${employee?.employeeName} (${employee?.employeeId})`}
                                className={classes.chip}
                              />
                            );
                          })}
                        </div>
                      );
                    }}
                  >
                    <MenuItem value="-1" disabled>
                      {"Pilih Notified Employee"}
                    </MenuItem>
                    {notifierEmployees
                      .filter((v, i, a) => a.findIndex((x) => x.departmentName == v.departmentName) == i)
                      .map((d, dI) => [
                        <ListSubheader key={d.departmentName ?? dI}>{d.departmentName}</ListSubheader>,
                        notifierEmployees
                          .filter((e) => e.departmentName == d.departmentName)
                          .map((e) => (
                            <MenuItem key={e.employeeId} value={e.employeeId}>
                              <Checkbox
                                checked={this.state.data?.employeeNotifiedIdEmployees?.some(
                                  (x) => x.employeeId == e.employeeId,
                                )}
                                color="primary"
                                size="small"
                              />
                              <span className="mr-2">{e.employeeName}</span>
                              {e.positionName != null ? (
                                <Chip label={e.positionName} size="small" className="mr-2" />
                              ) : (
                                ""
                              )}
                              <Chip variant="outlined" label={e.employeeId} size="small" />
                            </MenuItem>
                          )),
                      ])}
                  </SelectFormsy>
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                {this.state.organizationData[0].maxUserApp > 0 && (
                  <Grid item xs={12} sm={6} className="mt-32">
                    <SelectFormsy
                      name="appStatus"
                      label="App Status"
                      value={[this.state.data!.appStatus]}
                      variant="outlined"
                      onChange={this.handleInputChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon icon="mdi:cellphone" />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment
                          position="end"
                          className="mr-16"
                          style={{
                            color:
                              this.state.organizationData[0].activeUserApp >= this.state.organizationData[0].maxUserApp
                                ? this.props.theme.palette.error.main
                                : undefined,
                          }}
                        >
                          Limit {this.state.organizationData[0].activeUserApp}/
                          {this.state.organizationData[0].maxUserApp}
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="" disabled>
                        {"Pilih App Status"}
                      </MenuItem>
                      <MenuItem
                        value={true as unknown as string}
                        disabled={
                          this.state.organizationData[0].activeUserApp >= this.state.organizationData[0].maxUserApp
                        }
                      >
                        Enable
                      </MenuItem>
                      <MenuItem value={false as unknown as string}>Disable</MenuItem>
                    </SelectFormsy>
                    {this.state.organizationData[0].activeUserApp >= this.state.organizationData[0].maxUserApp && (
                      <Alert severity="error" className="mt-8">
                        Sepertinya limit aplikasi telah melampaui batas, hubungi kami untuk menambahkan limit
                      </Alert>
                    )}
                  </Grid>
                )}
                {process.env.REACT_APP_ONPREMISE != "true" && this.state.organizationData[0].maxUserApp <= 0 && (
                  <Grid item xs={12} sm={6} md={4} className="mt-32">
                    <Card>
                      <Grid container>
                        <Grid item xs={4}>
                          <img
                            src="https://absendulu.id/wp-content/uploads/2023/01/Absendulu-Confirmed.png"
                            alt="Absendulu.id"
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <CardContent>
                            <Typography gutterBottom variant="h6" component="h2">
                              Aplikasi Mobile Absendulu.id
                            </Typography>
                            <Typography variant="body1" color="textPrimary" component="p">
                              Memungkinkan <b>karyawan</b> untuk <b>absen</b> dengan cara <b>selfie</b> melalui{" "}
                              <b>smartphone</b>.<br />
                              Hubungi kami untuk mendapatkan fitur ini!
                            </Typography>
                          </CardContent>
                        </Grid>
                      </Grid>

                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          className={classes.cardActionRight}
                          component={Link}
                          to={{ pathname: "https://absendulu.id/" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Pelajari lebih lanjut
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )}
              </Grid>

              <Tabs
                value={this.state.tabValue}
                onChange={(_, value) =>
                  this.setState({
                    tabValue: value,
                  })
                }
                indicatorColor="primary"
                textColor="primary"
                className="mt-32 mb-16"
              >
                <Tab label={`${href[3] !== "add" ? "Change " : ""} Password`} />
                <Tab label="Private Information" />
                {(this.state.organizationData[0].maxDevice != 0 ||
                  this.state.organizationData[0].activeDevice != 0) && <Tab label="Device Access Setting" />}
              </Tabs>

              {this.state.tabValue == 0 && (
                <React.Fragment>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextFieldFormsy
                        variant="outlined"
                        type="password"
                        name="password"
                        label={"Password"}
                        debounce
                        onChange={this.handleInputChange}
                        value=""
                        validations="minLength:6"
                        validationErrors={formsyErrorMessage(t, "Password", {
                          minLength: 6,
                        })}
                        required={href[3] === "add"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextFieldFormsy
                        variant="outlined"
                        type="password"
                        name="Ulangi Password"
                        label={"Ulangi Password"}
                        debounce
                        onChange={this.handleInputChange}
                        value=""
                        validations={{ equalsField: "password" }}
                        validationErrors={formsyErrorMessage(t, "Ulangi Password", { equalsField: "Password" })}
                        required={href[3] === "add"}
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}

              {this.state.tabValue != 0 && (
                <Grid container spacing={2}>
                  {tabFieldData[this.state.tabValue - 1].fieldData.map((item, index) => {
                    if (item.type === "text" || item.type === "password" || item.type === "date") {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextFieldFormsy
                            variant="outlined"
                            type={item.type}
                            name={item.name}
                            label={item.label}
                            debounce
                            onChange={this.handleInputChange}
                            value={
                              item.type === "date"
                                ? this.state.data![item.name] != null && this.state.data![item.name] != ""
                                  ? moment(this.state.data![item.name]).format("YYYY-MM-DD")
                                  : ""
                                : this.state.data![item.name]
                            }
                            multiline={item.multiline}
                            minRows={item.rows}
                            maxRows={item.rowsMax}
                            validations={item.validations}
                            validationErrors={item.validationErrors}
                            InputLabelProps={{
                              shrink: item.type === "date" ? true : undefined,
                            }}
                            required={item.required}
                          />
                        </Grid>
                      );
                    } else if (item.type == "select") {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <SelectFormsy
                            name={item.name}
                            label={item.label}
                            value={[this.state.data![item.name]]}
                            validations={item.validations}
                            validationErrors={item.validationErrors}
                            variant="outlined"
                            onChange={this.handleInputChange}
                            required={item.required}
                          >
                            <MenuItem value="" disabled>
                              {"Pilih " + item.label}
                            </MenuItem>
                            {item.option.map((item, index) => {
                              return (
                                <MenuItem key={index} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              );
                            })}
                          </SelectFormsy>
                        </Grid>
                      );
                    } else {
                      throw new Error(`tabFieldData.name = ${item?.name} not implemented.`);
                    }
                  })}
                </Grid>
              )}
            </Formsy>
            <Button variant="contained" style={{ marginTop: "16px" }} color="default" onClick={() => history.goBack()}>
              Batal
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!this.state.isFormValid}
              style={{ marginTop: "16px", marginLeft: "8px" }}
              onClick={async () => await this.handleSubmit()}
            >
              Simpan
            </Button>
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  access: state.globalReducer.pageRule,
  model: state.model,
});

const mapDispatchToProps = {
  setNavigation: Actions.setNavigation,
  setUser: AuthActions.setUser,
  createData,
  updateData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(Form)));

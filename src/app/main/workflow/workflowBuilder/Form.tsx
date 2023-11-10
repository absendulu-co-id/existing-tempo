import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { workflowBuilderConfig } from "./Config";
import { FieldData } from "./FieldData";
import { FuseLoading, FusePageCarded, SelectFormsy, TextFieldFormsy } from "@fuse";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { WithStyles } from "@material-ui/styles";
import { createData, updateData } from "@mid/store/model/action.model";
import { ModelState } from "@mid/store/model/reducer.model";
import { UserState } from "app/auth/store/reducers/user.reducer";
import { datetimeToIsoString } from "app/services/dateFunction";
import { GlobalReducerStatePageRule } from "app/store/reducers/global.reducer";
import { reactTableCustomStyles } from "app/styles/materialTableTheme";
import axios from "axios";
import Formsy from "formsy-react";
import moment from "moment";
import { Component } from "react";
import DataTable from "react-data-table-component";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import swal from "sweetalert";
import Swal from "sweetalert2/dist/sweetalert2.js";

interface Props extends WithTranslation, WithStyles<typeof styles, true> {
  user: UserState;
  access: GlobalReducerStatePageRule;
  model: ModelState;

  setNavigation: (navigation) => void;
  setUser: (user) => void;
  createData: (endPoint, data) => void;
  updateData: (endPoint, data, id) => void;
}

interface States {
  success: boolean;
  redirect: boolean;
  loading: boolean;
  loadingTable: boolean;
  data: any;
  positionData: any;
  departmentData: any;
  organizationData: any;
  workflowBuilderDetail: any;
  employeeModal: boolean;
  employeeData: any;
  perPageTable: number;
  totalRows: number;
  page: number;
  column: { name: string }[];
  primaryKey: string;
  filterTextEmployee: string;
  resetPaginationEmployees: boolean;
  search: boolean;
  filterTextSelected: string;
  order: any;
  columns: any;
  selectedColumns: any;
  isFormValid: boolean;
  primaryKeyId?: string;
}

const styles = (theme) => ({
  input: {
    height: 10,
    fontSize: 12,
  },
  layoutRoot: {},
});

class Form extends Component<Props, States> {
  state: States = {
    success: false,
    redirect: false,
    loading: true,
    loadingTable: false,
    data: { employees: [] },
    positionData: [],
    departmentData: [],
    organizationData: [],
    workflowBuilderDetail: [],
    employeeModal: false,
    employeeData: [],
    perPageTable: 10,
    totalRows: 0,
    page: 1,
    column: [{ name: "Aksi" }, { name: "No. Node" }, { name: "Nama" }],
    primaryKey: "workflowBuilderId",
    filterTextEmployee: "",
    resetPaginationEmployees: false,
    search: false,
    filterTextSelected: "",
    order: null,
    isFormValid: false,
    columns: [
      {
        cell: (row) => {
          return (
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                this.setState((prevState) => {
                  const find = prevState.data.employees.find((item) => item.employeeId === row.employeeId);
                  return {
                    data: {
                      ...prevState.data,
                      employees: find
                        ? prevState.data.employees.filter((item) => item.employeeId !== find.employeeId)
                        : [...prevState.data.employees, row],
                    },
                  };
                });
              }}
            >
              <Icon>{"check"}</Icon>
            </IconButton>
          );
        },
        maxWidth: "5px",
        center: true,
      },
      {
        name: "NIK",
        selector: (row) => row.employeeId,
        sortable: true,
        sortField: "employeeId",
      },
      {
        name: "Employee",
        selector: (row) => row.employeeName,
        sortable: true,
        sortField: "employeeName",
      },
      {
        name: "Department",
        selector: (row) => row.department?.departmentName,
        sortable: false,
      },
    ],
    selectedColumns: [
      {
        cell: (row) => {
          const find = this.state.data.employees.find((item) => item.employeeId === row.employeeId);
          return (
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                if (!find) {
                  this.setState((prevState) => ({
                    data: {
                      ...prevState.data,
                      employees: [...prevState.data.employees, row],
                    },
                  }));
                  this.forceUpdate();
                } else {
                  const filter = this.state.data.employees.filter((item) => item.employeeId !== row.employeeId);
                  this.setState((prevState) => ({
                    data: { ...prevState.data, employees: filter },
                  }));
                }
              }}
            >
              <Icon>{find ? "delete" : "add"}</Icon>
            </IconButton>
          );
        },
        maxWidth: "5px",
        center: true,
      },
      {
        name: "NIK",
        selector: (row) => row.employeeId,
        sortable: true,
        sortField: "employeeId",
      },
      {
        name: "Employee",
        selector: (row) => row.employeeName,
        sortable: true,
        sortField: "employeeName",
      },
      {
        name: "Department",
        selector: (row) => row.department?.departmentName,
        sortable: false,
      },
    ],
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
    await this.fetchDataTable(1);

    if (itemData !== undefined) {
      const workflowBuilderDetail = itemData.workflownodes;
      delete itemData.workflownodes;
      const employees = typeof itemData.employees === "string" ? JSON.parse(itemData.employees) : itemData.employees;
      this.setState({
        data: { ...itemData, employees },
        workflowBuilderDetail,
      });
    } else {
      FieldData.map((item, index) => {
        return (data[item.name] = item.value);
      });
      this.setState({
        data,
      });
    }
    this.setState({ loading: !this.state.loading });
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

  handleInputChangePosition = (event, target) => {
    const index = this.state.positionData.findIndex((item) => item.positionId == event.target.value);
    if (target) {
      if (target === "clear") {
        this.setState((prevState) => {
          const data = prevState.data;
          data.positionId = null;
          data.positionName = null;
          return { data };
        });
      }
    } else {
      this.setState((prevState) => ({
        data: {
          ...prevState.data,
          positionName: prevState.positionData[index].positionName,
          positionId: prevState.positionData[index].positionId,
        },
      }));
    }
  };

  handleInputChangeOrganization = (event) => {
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        organizationName: event.organizationName,
        organizationId: event.organizationId,
      },
    }));
  };

  handleInputChangeDepartment = (event, target) => {
    const index = this.state.departmentData.findIndex((item) => item.departmentId == event.target.value);
    if (target) {
      if (target === "clear") {
        this.setState((prevState) => {
          const data = prevState.data;
          data.departmentId = null;
          data.departmentName = null;
          return { data };
        });
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

  handleDetailChange = (index) => (evt) => {
    const newDetailData = this.state.workflowBuilderDetail.map((item, subIndex) => {
      if (index !== subIndex) return item;
      return { ...item, [evt.target.name]: evt.target.value };
    });

    this.setState({ workflowBuilderDetail: newDetailData });
  };

  handleAddDetail = () => {
    const position = this.state.workflowBuilderDetail.length + 1;
    this.setState({
      workflowBuilderDetail: this.state.workflowBuilderDetail.concat([
        {
          workflowNodeNumber: position,
          workflowNodeName: "",
          workflowNodeApprover: [],
          workflowNodeNotifier: [],
          workflowNodeApproverScope: "Own Department",
          workflowNodeNotifierScope: "Own Department",
        },
      ]),
    });
  };

  handleDeleteDetail = async (index, workflowNodeId) => {
    if (!workflowNodeId) {
      this.setState((state) => {
        const workflowBuilderDetail = state.workflowBuilderDetail.filter((item, subIndex) => index !== subIndex);
        return {
          workflowBuilderDetail,
        };
      });
    } else {
      const swalResult = await Swal.fire({
        title: "Yakin untuk menghapus data ini?",
        text: "Data yang terhapus tidak dapat dikembalikan lagi!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "OK",
      });

      if (swalResult.isConfirmed) {
        this.setState({ loading: true });
        const response = await axios.delete(`/${workflowBuilderConfig.endPoint}/${workflowNodeId}`);
        if (response.status === 200) {
          await swal("Sukses!", "Data berhasil dihapus!", "success");

          await this.componentDidMount();
        } else if (response.status === 401) {
          await swal("Error!", "Maaf, terjadi kesalahan.", "error");

          localStorage.clear();
          this.setState({
            redirect: true,
          });
        }
        this.setState({ loading: false });
      } else {
        await swal("Penghapusan di batalkan");
        this.setState({ loading: false });
      }
    }
  };

  handleSubmit = () => {
    if (this.state.workflowBuilderDetail.length === 0) {
      return swal("Perhatian!", "Daftar Workflow Node harus diisi!", "warning");
    }
    this.setState({
      loading: !this.state.loading,
    });
    const employees = this.state.data.employees.map((item) => ({
      employeeId: item.employeeId,
      employeeName: item.employeeName,
    }));
    const info = {
      ...this.state.data,
      startDate: datetimeToIsoString(this.state.data.startDate),
      endDate: datetimeToIsoString(this.state.data.endDate, true),
      organizationId:
        this.props.user.data.userType !== "mid-admin"
          ? this.props.user.data.defaultOrganizationAccess
            ? `${this.props.user.data.defaultOrganizationAccess.organizationId}`
            : this.state.data.organizationId
          : this.state.data.organizationId,
      organizationName:
        this.props.user.data.userType !== "mid-admin"
          ? this.props.user.data.defaultOrganizationAccess
            ? `${this.props.user.data.defaultOrganizationAccess.organizationName}`
            : this.state.data.organizationName
          : this.state.data.organizationName,
    };
    const data = {
      info: { ...info, employees },
      details: this.state.workflowBuilderDetail,
    };
    const href = window.location.pathname.split("/");
    if (href[3] === "add") {
      this.props.createData(workflowBuilderConfig.endPoint, data);
    } else if (href[3] === "edit") {
      this.props.updateData(workflowBuilderConfig.endPoint, data, this.state.primaryKeyId);
    }
    this.setState({
      loading: false,
    });
  };

  getSelectData = async () => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin" && this.props.user.data.defaultOrganizationAccess
        ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
        : "";

    const res = await Promise.all([
      axios.get(`/Department?filter[order]=departmentName%20asc${filterDefaultOrganization}`),
      axios.get(`/Position?filter[order]=positionName%20asc${filterDefaultOrganization}`),
      axios.get(`/Organizations?filter[order]=organizationName%20asc${filterDefaultOrganization}`),
    ]);

    this.setState({
      departmentData: res[0].data.rows,
      positionData: res[1].data.rows,
      organizationData: res[2].data.rows,
    });
  };

  fetchDataTable = async (
    page,
    filterSearch = this.state.filterTextEmployee ? "&filter[where][employeeId]=" + this.state.filterTextEmployee : "",
  ) => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? this.props.user.data.defaultOrganizationAccess
          ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
          : ""
        : "";
    const filterOrderBy = this.state.order ? `&filter[order]=${this.state.order}` : "";
    this.setState({
      loadingTable: true,
    });
    const indexOfLastTodo = page * this.state.perPageTable;
    const skip = indexOfLastTodo - this.state.perPageTable;
    const response = await axios.get(
      `/Employees?filter[limit]=${this.state.perPageTable}&filter[skip]=${skip}${filterDefaultOrganization}${filterSearch}${filterOrderBy}&filter[include]=department`,
    );
    this.setState((prevState) => ({
      loadingTable: false,
      employeeData: response.data.rows,
      totalRows: response.data.count,
      page,
    }));
  };

  handlePageChange = async (page) => {
    await this.fetchDataTable(page);
  };

  handlePerRowsChange = async (newPerPage, page) => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? this.props.user.data.defaultOrganizationAccess
          ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
          : ""
        : "";
    const filterOrderBy = this.state.order ? `&filter[order]=${this.state.order}` : "";
    const filterSearch = this.state.search ? `&filter[where][employeeId]=${this.state.filterTextEmployee}` : "";
    this.setState({
      loadingTable: true,
    });
    const indexOfLastTodo = page * this.state.perPageTable;
    const skip = indexOfLastTodo - this.state.perPageTable;
    const response = await axios.get(
      `/Employees?filter[limit]=${this.state.perPageTable}&filter[skip]=${skip}${filterDefaultOrganization}${filterSearch}${filterOrderBy}&filter[include]=department`,
    );
    this.setState({
      loadingTable: false,
      employeeData: response.data.rows,
      totalRows: response.data.count,
      perPageTable: newPerPage,
    });
  };

  handleSort = async (column, sortDirection) => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? this.props.user.data.defaultOrganizationAccess
          ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
          : ""
        : "";
    const filterSearch = this.state.search ? `&filter[where][employeeId]=${this.state.filterTextEmployee}` : "";
    this.setState({
      loadingTable: true,
    });
    const indexOfLastTodo = this.state.page * this.state.perPageTable;
    const skip = indexOfLastTodo - this.state.perPageTable;
    const response = await axios.get(
      `/Employees?filter[limit]=${this.state.perPageTable}&filter[skip]=${skip}&filter[order]=${column.sortField}%20${sortDirection}${filterDefaultOrganization}${filterSearch}&filter[include]=department`,
    );
    this.setState({
      loadingTable: false,
      order: `${column.sortField}%20${sortDirection}`,
      employeeData: response.data.rows,
      totalRows: response.data.count,
    });
  };

  handleClearEmployeeText = async () => {
    const { resetPaginationEmployees } = this.state;

    if (this.state.filterTextEmployee) {
      this.setState({
        resetPaginationEmployees: !resetPaginationEmployees,
        filterTextEmployee: "",
        search: false,
      });
      await this.fetchDataTable(1, "");
    }
  };

  getSubHeaderComponentEmployee = () => {
    return (
      <TextField
        size="small"
        margin="dense"
        autoComplete="off"
        variant="outlined"
        type={"text"}
        name={"employeeName"}
        label={"NIK"}
        onChange={(e) => {
          const newFilterText = e.target.value;
          this.setState({ filterTextEmployee: newFilterText });
        }}
        value={this.state.filterTextEmployee}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                size="small"
                onClick={async () => {
                  this.setState({
                    search: true,
                  });

                  await this.fetchDataTable(1);
                }}
              >
                <Icon>search</Icon>
              </IconButton>
              {this.state.search && (
                <IconButton color="primary" size="small" onClick={async () => await this.handleClearEmployeeText()}>
                  <Icon>clear</Icon>
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    );
  };

  getSubHeaderComponentSelected = () => {
    return (
      <TextField
        size="small"
        margin="dense"
        autoComplete="off"
        variant="outlined"
        type={"text"}
        name={"employeeName"}
        label={"Karyawan"}
        onChange={(e) => {
          const newFilterText = e.target.value;
          this.setState({ filterTextSelected: newFilterText });
        }}
        value={this.state.filterTextSelected}
      />
    );
  };

  async componentDidMount() {
    const { addRule, editRule } = this.props.access;
    const href = window.location.pathname.split("/");

    if (href[3] === "edit") {
      if (!editRule) {
        this.setState({ loading: true });
        await swal("Error!", "Maaf, Anda tidak memiliki Akses.", "error");
        history.goBack();
      } else {
        const id = href[4];
        this.setState({ primaryKeyId: id });
        const res = await axios.get(`/${workflowBuilderConfig.endPoint}/${id}?filter[include]=workflownodes`);
        await this.handleFormField(res.data);
      }
    } else {
      if (!addRule) {
        this.setState({ loading: true });
        await swal("Error!", "Maaf, Anda tidak memiliki Akses.", "error");
        history.goBack();
      } else {
        await this.handleFormField();
      }
    }
  }

  render() {
    const { classes, t, model } = this.props;
    const { redirect, loading, data } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;
    const title3 = href[3] === "add" ? "Tambah " + title2 : "Ubah " + title2;
    const filteredItemSelected = data.employees.filter(
      (item) => (item) =>
        item.employeeName?.toLowerCase().includes(this.state.filterTextSelected.toLowerCase()) ||
        item.employeeId?.toLowerCase().includes(this.state.filterTextSelected.toLowerCase()),
    );

    if (redirect) {
      return <Redirect to="/login" />;
    } else if (loading || model.loading) {
      return <FuseLoading />;
    }

    return (
      <FusePageCarded
        classes={{
          root: classes.layoutRoot,
        }}
        header={<HeaderComponent breadcrumbs={[title, title2, title3]} titlePage={title2} />}
        contentToolbar={
          <div className="px-24">
            <h2>
              {href[3] === "add" ? "Tambah" : "Edit"} {title2}
            </h2>
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
              <Grid container spacing={2}>
                {FieldData.map((item, index) => {
                  if (item.type === "text" || item.type === "password" || item.type === "date") {
                    if (item.name === "employees") {
                      let empValues = "";
                      if (this.state.data[item.name]) {
                        this.state.data[item.name].map((item, index) => {
                          return (empValues = index === 0 ? item.employeeId : empValues + ", " + item.employeeId);
                        });
                      }
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextFieldFormsy
                            variant="outlined"
                            type={item.type}
                            name={item.name}
                            label={item.label}
                            value={empValues}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    disabled={
                                      this.state.data
                                        ? this.state.data.departmentId
                                          ? true
                                          : !!this.state.data.positionId
                                        : false
                                    }
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                      this.setState({
                                        employeeModal: true,
                                      });
                                    }}
                                  >
                                    <Icon>search</Icon>
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                          />
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextFieldFormsy
                            variant="outlined"
                            type={item.type}
                            name={item.name}
                            label={item.label}
                            onChange={this.handleInputChange}
                            value={
                              item.type === "date"
                                ? moment(this.state.data[item.name]).format("YYYY-MM-DD")
                                : this.state.data[item.name]
                            }
                            multiline={item.multiline}
                            rows={item.rows}
                            rowsMax={item.rowsMax}
                            validations={item.validations}
                            validationErrors={item.validationErrors}
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
                            required={item.required}
                          />
                        </Grid>
                      );
                    }
                  } else if (item.type === "select") {
                    if (item.option !== null) {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <SelectFormsy
                            name={item.name}
                            label={item.label}
                            value={[this.state.data[item.name]]}
                            validations={item.validations}
                            validationErrors={item.validationErrors}
                            variant="outlined"
                            onChange={this.handleInputChange}
                            required={item.required}
                          >
                            <MenuItem value="">{"Pilih " + item.label}</MenuItem>
                            {item.option?.map((item, index) => {
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
                      if (item.name === "positionId") {
                        return (
                          <Grid item xs={12} sm={6} key={index}>
                            <SelectFormsy
                              name={item.name}
                              label={item.label}
                              value={[this.state.data[item.name]]}
                              validations={item.validations}
                              validationErrors={item.validationErrors}
                              variant="outlined"
                              onChange={this.handleInputChangePosition}
                              required={item.required}
                              endAdornment={
                                <IconButton
                                  style={{
                                    visibility: this.state.data[item.name] ? "visible" : "hidden",
                                  }}
                                  onClick={(event) => this.handleInputChangePosition(event, "clear")}
                                >
                                  <Icon fontSize="small">close</Icon>
                                </IconButton>
                              }
                              disabled={
                                this.state.data
                                  ? this.state.data.employees
                                    ? this.state.data.employees.length > 0
                                    : false
                                  : false
                              }
                            >
                              <MenuItem value="" disabled>
                                {"Pilih " + item.label}
                              </MenuItem>
                              {this.state.positionData.map((item, index) => {
                                return (
                                  <MenuItem key={index} value={item.positionId}>
                                    {item.positionName}
                                  </MenuItem>
                                );
                              })}
                            </SelectFormsy>
                          </Grid>
                        );
                      } else if (item.name === "departmentId") {
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
                              disabled={
                                this.state.data
                                  ? this.state.data.employees
                                    ? this.state.data.employees.length > 0
                                    : false
                                  : false
                              }
                              endAdornment={
                                <IconButton
                                  style={{
                                    visibility: this.state.data[item.name] ? "visible" : "hidden",
                                  }}
                                  onClick={(event) => this.handleInputChangeDepartment(event, "clear")}
                                >
                                  <Icon fontSize="small">close</Icon>
                                </IconButton>
                              }
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
              <Table size="small" style={{ marginTop: 12 }}>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="h6">Daftar Workflow Node</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {this.state.column.map((item, index) => {
                      return (
                        <TableCell key={index}>
                          <b>{item.name}</b>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.workflowBuilderDetail.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color="default"
                            disabled={href[3] === "edit"}
                            onClick={async () => {
                              await this.handleDeleteDetail(index, item.workflowNodeId);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                        <TableCell>
                          <TextFieldFormsy
                            size="small"
                            fullWidth
                            variant="outlined"
                            type="text"
                            name="workflowNodeNumber"
                            onChange={this.handleDetailChange(index)}
                            value={item.workflowNodeNumber}
                            validations="isExisty"
                            validationErrors={{
                              isExisty: "Field Harus diisi",
                            }}
                            disabled={href[3] === "edit"}
                          />
                        </TableCell>
                        <TableCell>
                          <TextFieldFormsy
                            size="small"
                            fullWidth
                            variant="outlined"
                            type="text"
                            name="workflowNodeName"
                            onChange={this.handleDetailChange(index)}
                            value={item.workflowNodeName}
                            validations="isExisty"
                            validationErrors={{
                              isExisty: "Field Harus diisi",
                            }}
                            disabled={href[3] === "edit"}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: "center" }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        disabled={href[3] === "edit"}
                        onClick={() => {
                          this.handleAddDetail();
                        }}
                      >
                        Tambah
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <Dialog
                  open={this.state.employeeModal}
                  onClose={() => this.setState({ employeeModal: false })}
                  fullWidth
                  maxWidth="lg"
                >
                  <DialogContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={1}>
                          <DataTable
                            paginationResetDefaultPage={this.state.resetPaginationEmployees}
                            fixedHeader
                            fixedHeaderScrollHeight="400px"
                            title="Daftar Karyawan"
                            columns={this.state.columns}
                            data={this.state.employeeData}
                            customStyles={reactTableCustomStyles}
                            dense
                            progressPending={this.state.loadingTable}
                            pagination
                            paginationServer
                            paginationTotalRows={this.state.totalRows}
                            onChangeRowsPerPage={this.handlePerRowsChange}
                            onChangePage={this.handlePageChange}
                            onSort={this.handleSort}
                            sortServer
                            paginationComponentOptions={{ noRowsPerPage: true }}
                            subHeader
                            subHeaderComponent={this.getSubHeaderComponentEmployee()}
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={1}>
                          <DataTable
                            fixedHeader
                            fixedHeaderScrollHeight="400px"
                            title={`${this.state.data.employees.length} Karyawan dipilih`}
                            columns={this.state.selectedColumns}
                            data={filteredItemSelected}
                            customStyles={reactTableCustomStyles}
                            dense
                            pagination
                            paginationComponentOptions={{ noRowsPerPage: true }}
                            subHeader
                            subHeaderComponent={this.getSubHeaderComponentSelected()}
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.setState({ employeeModal: false })} color="primary" autoFocus>
                      Tutup
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>

              <Button variant="contained" style={{ marginTop: "2%" }} color="default" onClick={() => history.goBack()}>
                Batal
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!this.state.isFormValid}
                style={{ marginTop: "2%", marginLeft: "1%" }}
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
  access: state.globalReducer.pageRule,
  model: state.model,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setNavigation: (navigation) => {
      dispatch(Actions.setNavigation(navigation));
    },
    setUser: (user) => {
      dispatch(AuthActions.setUser(user));
    },
    createData: (endPoint, data) => {
      dispatch(createData(endPoint, data));
    },
    updateData: (endPoint, data, userId) => {
      dispatch(updateData(endPoint, data, userId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(withTranslation()(Form)));

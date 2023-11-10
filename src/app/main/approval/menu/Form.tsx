import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { FieldData } from "./FieldData";
import { RootState } from "@/app/store";
import { DateTimeFormsy, FuseLoading, FusePageCarded, SelectFormsy, TextFieldFormsy } from "@fuse";
import { Button, Grid, Icon, IconButton, InputAdornment, MenuItem, Paper, TextField } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import { createData, updateApproval, updateData } from "@mid/store/model/action.model";
import { punchStates } from "app/components/PunchStateComponent";
import { reactTableCustomStyles } from "app/styles/materialTableTheme";
import axios from "axios";
import Formsy from "formsy-react";
import moment from "moment";
import { Component } from "react";
import DataTable from "react-data-table-component";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import swal from "sweetalert";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  success: boolean;
  redirect: boolean;
  loading: boolean;
  loadingTable: boolean;
  data: any;
  typeData: any[];
  employeeData: any[];
  perPageTable: number;
  totalRows: number;
  page: number;
  selectedRows: any[];
  primaryKey: string;
  filterTextEmployee: string;
  resetPaginationEmployees: boolean;
  search: boolean;
  filterTextSelected: string;
  order: any | null;
  endPoint: string;
  typeName: string;
  typeId: string;
  typeLabel: string;
  isFormValid: boolean;
  id: string;
  columns: any[];
  selectedColumns: any[];
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
    loading: false,
    loadingTable: false,
    data: {},
    typeData: [],
    employeeData: [],
    perPageTable: 10,
    totalRows: 0,
    page: 1,
    selectedRows: [],
    primaryKey: "leaveId",
    filterTextEmployee: "",
    resetPaginationEmployees: false,
    search: false,
    filterTextSelected: "",
    order: null,
    endPoint: "",
    typeName: "",
    typeId: "",
    typeLabel: "",
    id: "",
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
                  const find = prevState.selectedRows.find((item) => item.employeeId === row.employeeId);
                  return {
                    selectedRows: find
                      ? prevState.selectedRows.filter((item) => item.employeeId !== find.employeeId)
                      : [...prevState.selectedRows, row],
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
        selector: (row) => row.department.departmentName,
        sortable: false,
      },
    ],
    selectedColumns: [
      {
        cell: (row) => {
          const find = this.state.selectedRows.find((item) => item.employeeId === row.employeeId);
          return (
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                if (!find) {
                  this.setState((prevState) => ({
                    selectedRows: [...prevState.selectedRows, row],
                  }));
                  this.forceUpdate();
                } else {
                  const filter = this.state.selectedRows.filter((item) => item.employeeId !== row.employeeId);
                  this.setState({
                    selectedRows: filter,
                  });
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
        selector: (row) => row.department.departmentName,
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

  handleFormField = async (itemData?) => {
    const data = {};
    const href = window.location.pathname.split("/");
    if (href[3] === "add") {
      await this.fetchDataTable(1);
    }
    if (itemData !== undefined) {
      this.setState({
        data: itemData,
      });
    } else {
      FieldData.forEach((item, index) => {
        return (data[item.name] = item.value);
      });
      this.setState({
        data,
      });
    }
    this.setState({ loading: false });
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

  handleInputChangeDateTime = (fieldName, date) => {
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        [fieldName]: date,
      },
    }));
  };

  handleInputChangeType = (event, name, id) => {
    const index = this.state.typeData.findIndex((item) => item[id] === event.target.value);
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        [name]: prevState.typeData[index][name],
        [id]: event.target.value,
      },
    }));
  };

  handleSubmit = async () => {
    const href = window.location.pathname.split("/");
    this.setState({ loading: true });
    if (href[3] === "add") {
      const data = this.state.selectedRows.map((item) => {
        return {
          employeeId: item.employeeId,
          employeeName: item.employeeName,
          departmentId: item.departmentId,
          positionId: item.positionId,
          organizationId: item.organizationId,
          organizationName: item.organizationName,
          auditTime: this.state.data.auditStatus === "Approved" ? new Date() : null,
          lastAuditorName: this.state.data.auditStatus === "Approved" ? this.props.user.data.displayName : null,
          ...this.state.data,
        };
      });
      await this.props.createData(`${this.state.endPoint}-Bulk`, data);
    } else if (href[3] === "edit") {
      if (this.state.data.auditStatus === "Approved") {
        const data = {
          auditStatus: this.state.data.auditStatus,
          auditRemark: this.state.data.auditRemark,
        };
        await this.props.updateApproval(this.state.id, data, true);
      } else {
        await this.props.updateData(this.state.endPoint, this.state.data, this.state.id);
      }
    }
    this.setState({
      loading: false,
    });
  };

  getData = async (endPoint, orderBy) => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? this.props.user.data.defaultOrganizationAccess
          ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
          : ""
        : "";
    await axios
      .all([
        axios.get(`/${endPoint}?filter[order]=${orderBy}%20asc${filterDefaultOrganization}`).then((res) => {
          this.setState({ typeData: res.data.rows });
        }),
      ])
      .catch((err) => {
        console.error(err);
        this.setState({ loading: true });
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
    this.setState({
      loadingTable: false,
      employeeData: response.data.rows,
      totalRows: response.data.count,
      page,
    });
  };

  handlePageChange = async (page) => {
    await this.fetchDataTable(page);
  };

  handlePerRowsChange = async (newPerPage, page) => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
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
        ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
        : "";
    const filterSearch = this.state.search ? `&filter[where][employeeId]=${this.state.filterTextEmployee}` : "";
    this.setState({
      loadingTable: true,
    });
    const indexOfLastTodo = this.state.page * this.state.perPageTable;
    const skip = indexOfLastTodo - this.state.perPageTable;
    const response = await axios.get(
      `/Employees?filter[limit]=${this.state.perPageTable}&filter[skip]=${skip}&filter[order]=${column.sortField}%20${sortDirection}${filterDefaultOrganization}${filterSearch}&filter[include]=Department`,
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
                <IconButton color="primary" size="small" onClick={() => this.handleClearEmployeeText()}>
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

  constructor(props: Props) {
    super(props);

    const href = window.location.pathname.split("/");

    if (href[2] === "leave") {
      this.state = {
        ...this.state,
        endPoint: "Leaves",
        typeName: "leaveTypeName",
        typeId: "leaveTypeId",
        typeLabel: "Tipe Cuti",
      };
    } else if (href[2] === "training") {
      this.state = {
        ...this.state,
        endPoint: "Trainings",
        typeName: "trainingTypeName",
        typeId: "trainingTypeId",
        typeLabel: "Tipe Pelatihan",
      };
    } else if (href[2] === "overtime") {
      this.state = {
        ...this.state,
        endPoint: "Overtimes",
        typeData: [
          { label: "Normal OT", value: 1 },
          { label: "Weekend OT", value: 2 },
          { label: "Holiday OT", value: 3 },
        ],
        typeName: "overtimeType",
        typeLabel: "Tipe Lembur",
      };
    } else if (href[2] === "manual_log") {
      const option = punchStates.map((item) => ({
        label: item.status,
        value: item.name,
      }));
      this.state = {
        ...this.state,
        endPoint: "ManualLogs",
        typeData: option,
        typeName: "punchState",
        typeLabel: "Punch State",
      };
    }
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const href = window.location.pathname.split("/");

    switch (href[2]) {
      case "leave": {
        await this.getData("LeaveType", this.state.typeName);
        break;
      }
      case "training": {
        await this.getData("trainingType", this.state.typeName);
        break;
      }
    }

    if (href[3] === "edit") {
      if (!this.props.access.editRule) {
        this.setState({ loading: true });
        await swal("Error!", "Maaf, Anda tidak memiliki Akses.", "error");
        history.goBack();
      } else {
        const id = href[4];
        this.setState({ id });
        const res = await axios.get(`/${this.state.endPoint}/${id}`);
        if (res.data) {
          await this.handleFormField(res.data);
        }
      }
    } else {
      if (!this.props.access.addRule) {
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
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;
    const title3 = href[3] === "add" ? "Tambah " + title2 : "Ubah " + title2;
    const filteredItemSelected = this.state.selectedRows.filter(
      (item) =>
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
              {href[3] === "add" ? (
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
                        title={`${this.state.selectedRows.length} Karyawan dipilih`}
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
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="mb-12"
                      fullWidth
                      variant="outlined"
                      type={"text"}
                      name={"employeeName"}
                      disabled={true}
                      label={"Karyawan"}
                      value={this.state.data.employeeName || ""}
                    />
                  </Grid>
                </Grid>
              )}
              <div className="h-24" />
              <Grid container spacing={2}>
                {FieldData.map((item, index) => {
                  if (href[2] !== "leave") {
                    if (item.name === "endDate") {
                      if (href[2] === "manual_log") {
                        item.name = "workCode";
                        item.type = "text";
                        item.label = "Work Code";
                      } else {
                        item.name = "endTime";
                        item.type = "datetime";
                        item.value = new Date();
                      }
                    } else if (item.name === "startDate") {
                      if (href[2] === "manual_log") {
                        item.name = "punchTime";
                        item.label = "Punch Time";
                        item.type = "datetime";
                      } else {
                        item.name = "startTime";
                        item.type = "datetime";
                      }
                      item.value = new Date();
                    } else if (item.name === "reason") {
                      item.name = "applyReason";
                    }
                  }
                  if (item.type === "text" || item.type === "password" || item.type === "date") {
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
                  } else if (item.type === "datetime") {
                    return (
                      <Grid item xs={12} sm={6} key={index}>
                        <DateTimeFormsy
                          inputVariant="outlined"
                          type={item.type}
                          name={item.name}
                          label={item.label}
                          onChange={(date) => this.handleInputChangeDateTime(item.name, date)}
                          value={this.state.data[item.name]}
                          validations={item.validations}
                          validationErrors={item.validationErrors}
                          InputLabelProps={{
                            shrink: item.type === "datetime" ? true : undefined,
                          }}
                          required={item.required}
                          minDate={item.name === "endTime" ? moment(this.state.data.startTime).format() : ""}
                          maxDate={
                            this.state.data
                              ? this.state.data.startTime
                                ? item.name === "startTime"
                                  ? moment(this.state.data.endTime).format()
                                  : ""
                                : ""
                              : ""
                          }
                        />
                      </Grid>
                    );
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
                      if (item.name === "type") {
                        if (href[2] === "overtime" || href[2] === "manual_log") {
                          return (
                            <Grid item xs={12} sm={6} key={index}>
                              <SelectFormsy
                                name={this.state.typeName}
                                label={this.state.typeLabel}
                                value={[this.state.data[this.state.typeName]]}
                                validations={item.validations}
                                validationErrors={item.validationErrors}
                                variant="outlined"
                                onChange={this.handleInputChange}
                                required={item.required}
                              >
                                <MenuItem value="">{"Pilih " + [this.state.typeLabel]}</MenuItem>
                                {this.state.typeData.map((item, index) => {
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
                          return (
                            <Grid item xs={12} sm={6} key={index}>
                              <SelectFormsy
                                name={this.state.typeName}
                                label={this.state.typeLabel}
                                value={[this.state.data[this.state.typeId]]}
                                validations={item.validations}
                                validationErrors={item.validationErrors}
                                variant="outlined"
                                onChange={(e) => this.handleInputChangeType(e, this.state.typeName, this.state.typeId)}
                                required={item.required}
                              >
                                <MenuItem value="" disabled>
                                  {"Pilih " + this.state.typeLabel}
                                </MenuItem>
                                {this.state.typeData.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={item[this.state.typeId]}>
                                      {item[this.state.typeName]}
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

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  access: state.globalReducer.pageRule,
  model: state.model,
});

const mapDispatchToProps = {
  setNavigation: Actions.setNavigation,
  setUser: AuthActions.setUser,
  createData: createData,
  updateData: updateData,
  updateApproval: updateApproval,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(Form)));

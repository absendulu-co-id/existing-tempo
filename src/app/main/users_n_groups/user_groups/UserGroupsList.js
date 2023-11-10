import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import ExportExcelComponent from "../../../components/ExportExcelComponent";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { customSelectStyles } from "../../../styles/customSelectStyles";
import { materialTableTheme } from "../../../styles/materialTableTheme";
import { userGroupConfig } from "./Config";
import { getAccess } from "./config/index";
import { FieldData } from "./FieldData";
import { FuseLoading, FusePageCarded } from "@fuse";
import MaterialTable from "@material-table/core";
import {
  Button,
  Grid,
  Icon,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/id_ID";
import { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router";
import { Link } from "react-router-dom";
import Select from "react-select";
import swal from "sweetalert";

const styles = (theme) => ({
  layoutRoot: {},
});

const hrefUrl = window.location.pathname.split("/");

class UserGroupsList extends Component {
  state = {
    navigationAccess: {
      allowAdd: false,
      allowEdit: false,
      allowDelete: false,
      allowExport: false,
    },
    columns: [
      {
        title: "Aksi",
        field: "tombolActions",
        sorting: false,
        render: (rowData) => (
          <Tooltip title={"Ubah " + this.props.t(hrefUrl[2])}>
            <IconButton
              disabled={!this.state.navigationAccess.allowEdit}
              component={Link}
              to={{
                pathname: `${userGroupConfig.routes[2].path}${rowData.userGroupId}`,
                state: {
                  userGroupId: rowData.userGroupId,
                },
              }}
            >
              <Icon fontSize="small">editsharp</Icon>
            </IconButton>
          </Tooltip>
        ),
      },
      {
        title: `${this.props.t(hrefUrl[2])}`,
        field: "userGroupName",
      },
    ],
    actions: [
      {
        icon: "delete",
        iconProps: { style: { color: "red" } },
        tooltip: "Hapus " + this.props.t(hrefUrl[2]) + " Terpilih",
        onClick: (evt, data) => this.onRowDelete(data),
      },
    ],
    urlParams: "",
    params: "",
    queryParams: "",
    order: false,
    orderBy: "userGroupName",
    spinner: false,
    redirect: false,
    perPage: 10,
    countTableData: 0,
    data: [],
    tableData: [],
    allData: [],
  };

  handleSearchField = () => {
    const data = {};
    const searchField = FieldData.filter((key) => {
      return key.search;
    });
    searchField.map((item, index) => {
      return (data[item.name] = "");
    });
    this.setState({
      data,
    });
  };

  handleSearching = () => {
    this.setState({ spinner: !this.state.spinner });
    let params = "";
    let countParams = "";
    let queryParams = "";
    const order = this.state.order;
    const orderBy = this.state.orderBy;
    const data = this.state.data;

    Object.keys(data).forEach((key, index) => {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        delete data[key];
      } else {
        queryParams = queryParams + "&" + key + "=" + data[key];
        params = params + "&filter[where][" + key + "]=" + data[key];
        if (index === 0) {
          countParams = "where[" + key + "]=" + data[key];
        } else {
          countParams = countParams + "&where[" + key + "]=" + data[key];
        }
      }
    });

    this.setState({
      urlParams: queryParams,
      params,
      countParams,
      currentPage: 1,
    });
    history.push("?page=" + 1 + "" + encodeURI(queryParams));

    void this.getDataTable(10, 0, "", "", params, countParams);
    void this.getAllDataWithFilter(orderBy, order, params);

    this.setState({ spinner: !this.state.spinner });
  };

  handleClick = async (page) => {
    history.push("?page=" + page + "" + encodeURI(this.state.urlParams));
    this.setState({
      currentPage: page,
    });
    const { perPage } = this.state;
    const indexOfLastTodo = page * perPage;
    const skip = indexOfLastTodo - perPage;
    const orderBy = this.state.orderBy;
    const order = !this.state.order;
    const params = this.state.params;
    const countParams = this.state.countParams;
    await this.getDataTable(perPage, skip, orderBy, order, params, countParams);
  };

  handleQueryParams = (page, searchParams) => {
    const data = {};
    let params = "";
    let countParams = "";
    let urlParams = "";
    let index = 0;
    for (const value of searchParams.keys()) {
      if (value !== "page") {
        urlParams = urlParams + "&" + value + "=" + searchParams.get(value);
        params = params + "&filter[where][" + value + "][like]=%25" + searchParams.get(value) + "%25";
        data[value] = searchParams.get(value);
        if (index === 0) {
          countParams = "where[" + value + "][like]=%25" + searchParams.get(value) + "%25";
        } else {
          countParams = countParams + "&where[" + value + "][like]=%25" + searchParams.get(value) + "%25";
        }
      }
      index++;
    }
    history.push(userGroupConfig.routes[0].path + "/?page=" + page + "" + encodeURI(urlParams));
    this.setState((prevState) => ({
      currentPage: page,
      urlParams,
      params,
      countParams,
      data: {
        ...prevState.data,
        ...data,
      },
    }));
    const { perPage } = this.state;
    const indexOfLastTodo = page * perPage;
    const skip = indexOfLastTodo - perPage;
    const orderBy = this.state.orderBy;
    const order = !this.state.order;
    void this.getAllDataWithFilter(orderBy, order, params);
    void this.getDataTable(perPage, skip, orderBy, order, params, countParams);
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

  handleClear = () => {
    history.push(userGroupConfig.routes[0].path + "/?page=1");
    this.setState({
      data: [],
      params: "",
      countParams: "",
      urlParams: "",
      allData: [],
    });
    this.componentDidMount();
  };

  onRowSort = (columns) => {
    const orderBy = columns.field;
    const order = this.state.order;
    const params = this.state.params;
    const countParams = this.state.countParams;
    const { perPage, currentPage } = this.state;
    const indexOfLastTodo = currentPage * perPage;
    const skip = indexOfLastTodo - perPage;
    if (order) {
      void this.getDataTable(perPage, skip, orderBy, order, params, countParams);
      void this.getAllDataWithFilter(orderBy, order, params);
      this.setState({ order: false, orderBy });
    } else {
      void this.getDataTable(perPage, skip, orderBy, order, params, countParams);
      void this.getAllDataWithFilter(orderBy, order, params);
      this.setState({ order: true, orderBy });
    }
  };

  deleteRow = async (x, y) => {
    const tmp = x[0];
    x.shift();
    await axios.get(`/Users?filter[where][userGroupId]=${tmp.userGroupId}`).then(async (res) => {
      if (res.data.count === 0) {
        await axios.delete(`/${userGroupConfig.endPoint}/${tmp.userGroupId}`).then(async () => {
          if (x.length > 0) {
            await this.deleteRow(x, y);
          } else {
            if (y > 0) {
              await swal(
                "Sukses!",
                "Data berhasil dihapus!, tetapi terdapat beberapa data yang digunakan dan tidak dihapus",
                "info",
              );
              this.componentDidMount();
            } else {
              await swal("Sukses!", "Data berhasil dihapus!", "success");
              this.componentDidMount();
            }
          }
        });
      } else {
        if (x.length > 0) {
          await this.deleteRow(x, y + 1);
        } else {
          if (y > 0) {
            await swal(
              "Sukses!",
              "Data berhasil dihapus!, tetapi terdapat beberapa data yang digunakan dan tidak dihapus",
              "info",
            );
            this.componentDidMount();
          } else {
            await swal("Sukses!", "Data berhasil dihapus!", "success");
            this.componentDidMount();
          }
        }
      }
    });
  };

  onRowDelete = async (oldData) => {
    const willDelete = await swal({
      title: "Apakah anda yakin?",
      text: "Apakah anda yakin untuk menghapus data ini? Data yang terhapus tidak dapat dikembalikan lagi!",
      icon: "warning",
      showCancelButton: true,
      buttons: true,
      dangerMode: true,
    });

    if (willDelete) {
      await this.deleteRow(oldData, 0);
    } else {
      await swal("Penghapusan di batalkan");
      this.setState({ loading: false });
    }
  };

  getDataTable = async (limit, skip, orderBy, order, params, countParams) => {
    this.setState({ spinner: !this.state.spinner });
    await axios
      .all([
        axios
          .get(
            `/${userGroupConfig.endPoint}?filter[limit]=${limit}&filter[skip]=${skip}&filter[order]=${
              orderBy === "" ? "userGroupName" : orderBy
            }%20${order === true ? "asc" : "desc"}${params === undefined ? "" : params}`,
          )
          .then((res) => {
            this.setState({
              dataTable: res.data.rows,
              countTableData: res.data.count,
            });
          }),
      ])
      .then((res) => {
        this.setState({
          spinner: !this.state.spinner,
        });
      });
  };

  getAllDataWithFilter = async (orderBy, order, params) => {
    await axios
      .get(
        `/${userGroupConfig.endPoint}?filter[order]=${orderBy === "" ? "userGroupName" : orderBy}%20${
          order === true ? "asc" : "desc"
        }${params === undefined ? "" : params}`,
      )
      .then((res) => {
        this.setState({ allData: res.data.rows });
      });
  };

  componentDidMount() {
    const { addAccess, editAccess, deleteAccess } = getAccess(this.props.access, this.props.location.pathname);
    this.setState({
      navigationAccess: {
        allowAdd: addAccess,
        allowEdit: editAccess,
        allowDelete: deleteAccess,
        allowExport: addAccess,
      },
    });
    this.handleSearchField();
    const search = window.location.search;
    const params = new URLSearchParams(search);
    let page = params.get("page");
    const pageIsNaN = isNaN(page);
    if (page === null || pageIsNaN) {
      this.handleQueryParams(1, params);
    } else {
      page = parseInt(page);
      this.handleQueryParams(page, params);
    }
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
            <h2>Daftar - {title2}</h2>
          </div>
        }
        content={
          <div className="pb-24">
            <div className="p-12">
              <Typography color="textPrimary" style={{ marginBottom: "2%" }}>
                Pencarian
              </Typography>
              <Grid container spacing={2}>
                {FieldData.map((item, index) => {
                  if (item.type === "text" && item.search) {
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
                          value={this.state.data[item.name] || ""}
                        />
                      </Grid>
                    );
                  } else if (item.type === "select" && item.search) {
                    if (item.option !== null) {
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <Select
                            value={this.state.data[item.name] ? this.state.data : ""}
                            placeholder={`Pilih ${item.label}`}
                            name={item.name}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            options={item.option}
                            onChange={this.handleInputChange}
                            styles={customSelectStyles}
                            isSearchable={true}
                            isLoading={this.state.spinner}
                          />
                        </Grid>
                      );
                    } else {
                      return "";
                    }
                  } else {
                    return "";
                  }
                })}
              </Grid>
              <Button
                variant="contained"
                style={{ marginTop: "2%" }}
                color="primary"
                onClick={() => this.handleSearching()}
              >
                <Icon className="text-20">search</Icon>
                Cari
              </Button>
              <Button
                variant="contained"
                style={{ marginTop: "2%", marginLeft: "1%" }}
                color="default"
                onClick={() => this.handleClear()}
              >
                Bersihkan
              </Button>
            </div>
            <div className="p-12">
              <form noValidate autoComplete="off">
                <div>
                  {this.state.navigationAccess.allowAdd ? (
                    <Button
                      variant="contained"
                      style={{ marginBottom: "2%" }}
                      color="primary"
                      component={Link}
                      to={userGroupConfig.routes[1].path}
                    >
                      <Icon className="text-20">add</Icon>
                      Tambah
                    </Button>
                  ) : (
                    ""
                  )}
                  <ExportExcelComponent
                    filename={title2}
                    style={{
                      marginBottom: "2%",
                      marginLeft: this.state.navigationAccess.allowAdd ? "1%" : "",
                    }}
                    columns={this.state.columns}
                    data={this.state.allData}
                  />
                  <MuiThemeProvider theme={materialTableTheme}>
                    <MaterialTable
                      size="small"
                      title=""
                      columns={this.state.columns}
                      data={this.state.dataTable}
                      isLoading={this.state.spinner}
                      actions={this.state.navigationAccess.allowDelete ? this.state.actions : ""}
                      options={{
                        filtering: false,
                        paging: false,
                        search: false,
                        selection: this.state.navigationAccess.allowDelete,
                        pageSize: 10,
                      }}
                      localization={{
                        toolbar: {
                          nRowsSelected: "{0} baris data terpilih",
                        },
                        body: {
                          emptyDataSourceMessage: "Tidak ada data ditampilkan",
                        },
                      }}
                      components={{
                        Header: (props) => (
                          <TableHead>
                            <TableRow>
                              {this.state.navigationAccess.allowDelete ? <TableCell>#</TableCell> : ""}

                              {this.state.columns.map((headCell) => (
                                <TableCell
                                  key={headCell.field}
                                  sortDirection={
                                    this.state.orderBy === headCell.field ? (this.state.order ? "asc" : "desc") : false
                                  }
                                  align={headCell.type === "numeric" ? "right" : ""}
                                >
                                  {headCell.sorting === false ? (
                                    headCell.title
                                  ) : (
                                    <TableSortLabel
                                      active={this.state.orderBy === headCell.field}
                                      direction={
                                        this.state.orderBy === headCell.field
                                          ? this.state.order
                                            ? "asc"
                                            : "desc"
                                          : !this.state.order
                                          ? "desc"
                                          : "asc"
                                      }
                                      onClick={() => this.onRowSort(headCell)}
                                    >
                                      {headCell.title}
                                    </TableSortLabel>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                        ),
                      }}
                    />
                  </MuiThemeProvider>
                </div>
              </form>
            </div>
            <div className="flex flex-1 items-center justify-between p-12">
              <Pagination
                showQuickJumper={{
                  goButton: (
                    <Button variant="contained" color="secondary">
                      Ok
                    </Button>
                  ),
                }}
                showTotal={(total, range) => `${range[0]} - ${range[1]} dari ${total} baris`}
                className="ant-pagination"
                onChange={this.handleClick}
                current={this.state.currentPage}
                total={this.state.countTableData}
                locale={localeInfo}
              />
            </div>
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  access: state.fuse.navigation[0].children,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setNavigation: (navigation) => {
      dispatch(Actions.setNavigation(navigation));
    },
    setUser: (user) => {
      dispatch(AuthActions.setUser(user));
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withStyles(styles, { withTheme: true })(withTranslation()(UserGroupsList))),
);

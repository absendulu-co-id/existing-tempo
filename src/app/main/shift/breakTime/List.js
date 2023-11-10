// import * as Actions from "../../../store/actions";
// import * as AuthActions from "../../../auth/store/actions";
// import {
//   Button,
//   FormControl,
//   Grid,
//   Icon,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Select,
//   TableCell,
//   TableHead,
//   TableRow,

//   TableSortLabel,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@material-ui/core";
// import { FieldData } from "./FieldData";
// import { FuseLoading, FusePageCarded } from "@fuse";
// import { Link } from "react-router-dom";
// import { Redirect } from "react-router";

// import { breakTimeConfig } from "./Config";
// import { connect } from "react-redux";
// import { materialTableTheme } from "../../../styles/materialTableTheme";
// import { withTranslation } from "react-i18next";
// import ExportExcelComponent from "../../../components/ExportExcelComponent";
// import HeaderComponent from "../../../components/HeaderComponent";
// import MaterialTable from "@material-table/core";
// import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
// import Pagination from "rc-pagination";
// import React, { Component } from "react";
// import axios from "axios";
// import history from "../../../services/history";
// import localeInfo from "rc-pagination/lib/locale/id_ID";
// import swal from "sweetalert";
// import withStyles from "@material-ui/core/styles/withStyles";
// // import { Select as SelectBox } from "@purple/phoenix-components";
// import { findNavigationAccess } from "app/services/arrayFunction";
// import _ from "lodash";

// const styles = (theme) => ({
//   layoutRoot: {},
// });

// const href = window.location.pathname.split("/");

// class List extends Component {
//   state = {
//     primaryKey: "breakTimeId",
//     navigationAccess: {
//       allowAdd: false,
//       allowEdit: false,
//       allowDelete: false,
//       allowExport: false,
//     },
//     columns: [
//       {
//         title: "Aksi",
//         field: "tombolActions",
//         sorting: false,
//         render: (rowData) => (
//           <Tooltip title={`Ubah ${this.props.t(href[2])}`}>
//             <IconButton
//               disabled={!this.state.navigationAccess.allowEdit}
//               component={Link}
//               to={{
//                 pathname: `${breakTimeConfig.routes[2].path}${
//                   rowData[this.state.primaryKey]
//                 }`,
//                 state: {
//                   [this.state.primaryKey]: rowData[this.state.primaryKey],
//                 },
//               }}
//             >
//               <Icon fontSize="small">editsharp</Icon>
//             </IconButton>
//           </Tooltip>
//         ),
//       },
//       {
//         title: "Nama",
//         field: "breakTimeName",
//       },
//       {
//         title: "Waktu Mulai",
//         field: "startTime",
//       },
//       {
//         title: "Waktu Akhir",
//         field: "endTime",
//       },
//       {
//         title: "Durasi(Menit)",
//         field: "duration",
//       },
//       {
//         title: "Tipe Penghitungan",
//         field: "calculateType",
//         render: (rowData) => {
//           switch (rowData.calculateType) {
//           case 1:
//             return "Kurangi Otomatis";
//           default:
//             return "";
//           }
//         },
//       },
//       {
//         title: "Perusahaan",
//         field: "organizationName",
//         hidden: this.props.user.data.userType !== "mid-admin",
//       },
//     ],
//     actions: [
//       {
//         icon: "delete",
//         iconProps: { style: { color: "red" } },
//         tooltip: `Hapus ${this.props.t(href[2])} Terpilih`,
//         onClick: (evt, data) => this.onRowDelete(data),
//       },
//     ],
//     urlParams: "",
//     params: "",
//     queryParams: "",
//     order: false,
//     orderBy: "breakTimeName",
//     spinner: false,
//     redirect: false,
//     perPage: 10,
//     countTableData: 0,
//     data: [],
//     allData: [],
//     organizationData: [],
//   };

//   handleInputChangeOrganization = (event) => {
//     this.setState((prevState) => ({
//       data: {
//         ...prevState.data,
//         organizationId: event.organizationId,
//         organizationName: event.organizationName,
//       },
//     }));
//   };

//   handleSearchField = () => {
//     const data = {};
//     const searchField = FieldData.filter((key) => {
//       return key.search === true;
//     });
//     searchField.map((item, index) => {
//       return (data[item.name] = "");
//     });
//     this.setState({
//       data,
//     });
//   };

//   handleSearching = () => {
//     this.setState({ spinner: !this.state.spinner });
//     let params = "";
//     let countParams = "";
//     let queryParams = "";
//     const order = this.state.order;
//     const orderBy = this.state.orderBy;
//     const data = this.state.data;
//     const token = this.state.token;

//     Object.keys(data).forEach((key, index) => {
//       if (data[key] === undefined || data[key] === null || data[key] === "") {
//         delete data[key];
//       } else {
//         queryParams = queryParams + "&" + key + "=" + data[key];
//         params = params + "&filter[where][" + key + "][like]=" + data[key] + "";
//         if (index === 0) {
//           countParams = "where[" + key + "][like]=" + data[key] + "";
//         } else {
//           countParams =
//             countParams + "&where[" + key + "][like]=" + data[key] + "";
//         }
//       }
//     });

//     this.setState({
//       urlParams: queryParams,
//       params,
//       countParams,
//       currentPage: 1,
//     });
//     history.push("?page=" + 1 + "" + encodeURI(queryParams));

//     this.getDataTable(token, 10, 0, orderBy, order, params, countParams);
//     this.getAllDataWithFilter(token, orderBy, order, params);

//     this.setState({ spinner: !this.state.spinner });
//   };

//   handleClick = (page) => {
//     history.push("?page=" + page + "" + encodeURI(this.state.urlParams));
//     this.setState({
//       currentPage: page,
//     });
//     const { perPage } = this.state;
//     const indexOfLastTodo = page * perPage;
//     const skip = indexOfLastTodo - perPage;
//     const token = this.state.token;
//     const orderBy = this.state.orderBy;
//     const order = !this.state.order;
//     const params = this.state.params;
//     const countParams = this.state.countParams;
//     this.getDataTable(
//       token,
//       perPage,
//       skip,
//       orderBy,
//       order,
//       params,
//       countParams,
//     );
//   };

//   handleQueryParams = (token, page, searchParams) => {
//     const data = {};
//     let params = "";
//     let countParams = "";
//     let urlParams = "";
//     let index = 0;
//     for (const value of searchParams.keys()) {
//       if (value !== "page") {
//         urlParams = urlParams + "&" + value + "=" + searchParams.get(value);
//         params =
//           params +
//           "&filter[where][" +
//           value +
//           "][like]=" +
//           searchParams.get(value) +
//           "";
//         data[value] = searchParams.get(value);
//         if (index === 0) {
//           countParams =
//             "where[" + value + "][like]=" + searchParams.get(value) + "";
//         } else {
//           countParams =
//             countParams +
//             "&where[" +
//             value +
//             "][like]=" +
//             searchParams.get(value) +
//             "";
//         }
//       }
//       index++;
//     }
//     history.push(
//       breakTimeConfig.routes[0].path +
//         "/?page=" +
//         page +
//         "" +
//         encodeURI(urlParams),
//     );
//     this.setState((prevState) => ({
//       currentPage: page,
//       urlParams,
//       params,
//       countParams,
//       data: {
//         ...prevState.data,
//         ...data,
//       },
//     }));
//     const { perPage } = this.state;
//     const indexOfLastTodo = page * perPage;
//     const skip = indexOfLastTodo - perPage;
//     const orderBy = this.state.orderBy;
//     const order = !this.state.order;
//     this.getAllDataWithFilter(token, orderBy, order, params);
//     this.getDataTable(
//       token,
//       perPage,
//       skip,
//       orderBy,
//       order,
//       params,
//       countParams,
//     );
//   };

//   handleInputChange = (event) => {
//     const nama = event.target.name;
//     const value = event.target.value;
//     this.setState((prevState) => ({
//       data: {
//         ...prevState.data,
//         [nama]: value,
//       },
//     }));
//   };

//   handleClear = () => {
//     history.push(breakTimeConfig.routes[0].path + "/?page=1");
//     this.setState({
//       data: [],
//       params: "",
//       countParams: "",
//       urlParams: "",
//       allData: [],
//     });
//     this.componentDidMount();
//   };

//   onRowSort = (columns) => {
//     const orderBy = columns.field;
//     const token = this.state.token;
//     const order = this.state.order;
//     const params = this.state.params;
//     const countParams = this.state.countParams;
//     const { perPage, currentPage } = this.state;
//     const indexOfLastTodo = currentPage * perPage;
//     const skip = indexOfLastTodo - perPage;
//     if (order === true) {
//       this.getDataTable(
//         token,
//         perPage,
//         skip,
//         orderBy,
//         order,
//         params,
//         countParams,
//       );
//       this.getAllDataWithFilter(token, orderBy, order, params);
//       this.setState({ order: false, orderBy });
//     } else {
//       this.getDataTable(
//         token,
//         perPage,
//         skip,
//         orderBy,
//         order,
//         params,
//         countParams,
//       );
//       this.getAllDataWithFilter(token, orderBy, order, params);
//       this.setState({ order: true, orderBy });
//     }
//   };

//   onRowDelete = (oldData) => {
//     const userToken = this.state.token;
//     swal({
//       title: "Apakah anda yakin?",
//       text: "Apakah anda yakin untuk menghapus data ini? Data yang terhapus tidak dapat dikembalikan lagi!",
//       icon: "warning",
//       showCancelButton: true,
//       buttons: true,
//       dangerMode: true,
//     }).then((willDelete) => {
//       if (willDelete) {
//         this.setState({ loading: true });
//         oldData.map(async (item) => {
//           try {
//             const response = await axios.delete(
//               `/${breakTimeConfig.endPoint}/${item[this.state.primaryKey]}`,
//             );
//             if (response.status === 200) {
//               swal("Sukses!", "Data berhasil dihapus!", "success").then(
//                 (value) => {
//                   this.componentDidMount();
//                 },
//               );
//             } else if (response.status === 401) {
//               swal("Error!", "Maaf, terjadi kesalahan.", "error").then(
//                 (value) => {
//                   localStorage.clear();
//                   this.setState({
//                     redirect: true,
//                   });
//                 },
//               );
//             }
//           } catch (error) {
//             swal("Error!", "Maaf, terjadi kesalahan.", "error").then(
//               (value) => {
//                 localStorage.clear();
//                 this.setState({
//                   redirect: true,
//                 });
//               },
//             );
//           }
//           this.setState({ loading: false });
//         });
//         this.setState({ loading: false });
//       } else {
//         swal("Penghapusan di batalkan");
//         this.setState({ loading: false });
//       }
//     });
//   };

//   getDataTable = (token, limit, skip, orderBy, order, params, countParams) => {
//     const filterDefaultOrganization =
//       this.props.user.data.userType !== "mid-admin"
//         ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
//         : "";
//     this.setState({ spinner: !this.state.spinner });
//     axios
//       .all([
//         axios
//           .get(
//             `/${
//               breakTimeConfig.endPoint
//             }?filter[limit]=${limit}&filter[skip]=${skip}&filter[order]=${
//               orderBy === "" ? this.state.orderBy : orderBy
//             }%20${order === true ? "asc" : "desc"}${
//               params === undefined ? "" : params
//             }${filterDefaultOrganization}`,
//           )
//           .then((res) => {
//             _.each(res.data.rows, (row) => {
//               if (row.breakTimeRoundOff) {
//                 row.breakTimeRoundOff = "Iya";
//               } else {
//                 row.breakTimeRoundOff = "Tidak";
//               }
//             });
//             this.setState({
//               dataTable: res.data.rows,
//               countTableData: res.data.count,
//             });
//           }),
//         axios
//           .get(
//             `/Organizations?filter[order]=organizationName%20asc${filterDefaultOrganization}`,
//           )
//           .then((res) => {
//             this.setState({ organizationData: res.data.rows });
//           }),
//       ])
//       .then((res) => {
//         this.setState({
//           spinner: !this.state.spinner,
//         });
//       });
//   };

//   getAllDataWithFilter = (token, orderBy, order, params) => {
//     const filterDefaultOrganization =
//       this.props.user.data.userType !== "mid-admin"
//         ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
//         : "";
//     axios
//       .get(
//         `/${breakTimeConfig.endPoint}?filter[order]=${
//           orderBy === "" ? this.state.orderBy : orderBy
//         }%20${order === true ? "asc" : "desc"}${
//           params === undefined ? "" : params
//         }${filterDefaultOrganization}`,
//       )
//       .then((res) => {
//         this.setState({ allData: res.data.rows });
//       });
//   };

//   componentDidMount () {
//     this.setState({ loading: !this.state.loading });
//     this.handleSearchField();
//     const search = window.location.search;
//     const params = new URLSearchParams(search);
//     let page = params.get("page");
//     const pageIsNaN = isNaN(page);
//     const token = localStorage.getItem("token");
//     if (token !== null) {
//       axios
//         .get("/auth/checkValidToken")
//         .then((res) => {
//           if (res.status === 200) {
//             const token = res.data.accessToken;
//             const userData = {
//               role: [res.data.userType],
//               data: {
//                 displayName: res.data.accountName,
//                 username: res.data.username,
//                 userId: res.data.userId,
//                 photoURL: "assets/images/avatars/profile.jpg",
//                 email: res.data.email,
//                 shortcuts: [],
//                 userType: res.data.userType,
//                 defaultOrganizationAccess: res.data.defaultOrganizationAccess,
//                 defaultEmployeeId: res.data.defaultEmployeeId,
//                 defaultDepartmentId: res.data.defaultDepartmentId,
//                 defaultPositionId: res.data.defaultPositionId,
//               },
//             };
//             this.props.setUser(userData);
//             let userMenu = res.data.userGroup.menujson;
//             userMenu = JSON.parse(userMenu);
//             this.props.setNavigation(userMenu);
//             const navigationAccess = findNavigationAccess(userMenu[0]);

//             if (page === null || pageIsNaN === true) {
//               this.handleQueryParams(token, 1, params);
//             } else {
//               page = parseInt(page);
//               this.handleQueryParams(token, page, params);
//             }
//             this.setState({
//               token,
//               navigationAccess,
//               loading: !this.state.loading,
//             });
//           } else {
//             swal("Error!", "Maaf, terjadi kesalahan.", "error").then(
//               (value) => {
//                 localStorage.clear();
//                 this.setState({
//                   redirect: true,
//                 });
//               },
//             );
//           }
//         })
//         .catch((err) => {
//           swal("Error!", "Maaf, terjadi kesalahan.", "error").then((value) => {
//             localStorage.clear();
//             this.setState({
//               redirect: true,
//             });
//           });
//         });
//     } else {
//       swal("Error!", "Maaf, terjadi kesalahan.", "error").then((value) => {
//         localStorage.clear();
//         this.setState({
//           redirect: true,
//         });
//       });
//     }
//   }

//   render () {
//     const { classes, t } = this.props;
//     const { redirect, loading } = this.state;
//     const href = window.location.pathname.split("/");
//     const title = t(href[1]);
//     const title2 = t(href[2]);
//     document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;

//     if (redirect) {
//       return <Redirect to="/login" />;
//     } else if (loading) {
//       return <FuseLoading />;
//     }

//     return (
//       <FusePageCarded
//         classes={{
//           root: classes.layoutRoot,
//         }}
//         header={
//           <HeaderComponent breadcrumbs={[title, title2]} titlePage={title2} />
//         }
//         contentToolbar={
//           <div className="px-24">
//             <h2>Daftar - {title2}</h2>
//           </div>
//         }
//         content={
//           <div className="pb-24">
//             <div className="p-12">
//               <Typography color="textPrimary" style={{ marginBottom: "2%" }}>
//                 Pencarian
//               </Typography>
//               <Grid container spacing={2}>
//                 {FieldData.map((item, index) => {
//                   if (item.type === "text" && item.search === true) {
//                     return (
//                       <Grid item xs={12} sm={6} key={index}>
//                         <TextField
//                           fullWidth
//                           variant="outlined"
//                           type={item.type}
//                           name={item.name}
//                           label={item.label}
//                           onChange={this.handleInputChange}
//                           multiline={item.multiline}
//                           rows={item.rows}
//                           rowsMax={item.rowsMax}
//                           value={this.state.data[item.name] || ""}
//                         />
//                       </Grid>
//                     );
//                   } else if (item.type === "select" && item.search === true) {
//                     if (item.option !== null) {
//                       return (
//                         <Grid item xs={12} sm={6} key={index}>
//                           <FormControl variant="outlined" fullWidth>
//                             <InputLabel shrink>{item.label}</InputLabel>
//                             <Select
//                               labelWidth={item.label.length * 8}
//                               name={item.name}
//                               value={
//                                 typeof this.state.data[item.name] !==
//                                 "undefined"
//                                   ? [this.state.data[item.name]]
//                                   : ""
//                               }
//                               variant="outlined"
//                               onChange={this.handleInputChange}
//                             >
//                               {item.option.map((subItem, subIndex) => {
//                                 return (
//                                   <MenuItem
//                                     key={subIndex}
//                                     value={subItem.value}
//                                   >
//                                     {subItem.label}
//                                   </MenuItem>
//                                 );
//                               })}
//                             </Select>
//                           </FormControl>
//                         </Grid>
//                       );
//                     }
//                     // else {
//                     //   if (
//                     //     item.name === "organizationId" &&
//                     //     this.props.user.data.userType === "mid-admin"
//                     //   ) {
//                     //     return (
//                     //       <Grid item xs={12} sm={6} key={index}>
//                     //         <SelectBox
//                     //           value={
//                     //             this.state.data[item.name]
//                     //               ? this.state.data
//                     //               : ""
//                     //           }
//                     //           label={`Pilih ${item.label}`}
//                     //           name={item.name}
//                     //           validations={item.validations}
//                     //           validationErrors={item.validationErrors}
//                     //           onChange={this.handleInputChangeOrganization}
//                     //           styles={customSelectStyles}
//                     //           options={this.state.organizationData}
//                     //           getOptionLabel={(option) =>
//                     //             option.organizationName
//                     //           }
//                     //           getOptionValue={(option) => option.organizationId}
//                     //           isSearchable={true}
//                     //           isLoading={this.state.spinner}
//                     //         />
//                     //       </Grid>
//                     //     );
//                     //   } else {
//                     //     return "";
//                     //   }
//                     // }
//                   } else {
//                     return "";
//                   }
//                 })}
//               </Grid>
//               <Button
//                 variant="contained"
//                 style={{ marginTop: "2%" }}
//                 color="primary"
//                 onClick={() => this.handleSearching()}
//               >
//                 <Icon className="text-20">search</Icon>
//                 Cari
//               </Button>
//               <Button
//                 variant="contained"
//                 style={{ marginTop: "2%", marginLeft: "1%" }}
//                 color="default"
//                 onClick={() => this.handleClear()}
//               >
//                 Bersihkan
//               </Button>
//             </div>
//             <div className="p-12">
//               <form noValidate autoComplete="off">
//                 <div>
//                   {this.state.navigationAccess.allowAdd
//                     ? (
//                       <Button
//                         variant="contained"
//                         style={{ marginBottom: "2%" }}
//                         color="primary"
//                         component={Link}
//                         to={breakTimeConfig.routes[1].path}
//                       >
//                         <Icon className="text-20">add</Icon>
//                       Tambah
//                       </Button>
//                     )
//                     : (
//                       ""
//                     )}
//                   <ExportExcelComponent
//                     filename={title2}
//                     style={{
//                       marginBottom: "2%",
//                       marginLeft: this.state.navigationAccess.allowAdd
//                         ? "1%"
//                         : "",
//                     }}
//                     columns={this.state.columns.filter((item) => !item.hidden)}
//                     data={this.state.allData}
//                   />
//                   <MuiThemeProvider theme={materialTableTheme}>
//                     <MaterialTable
//                       size="small"
//                       title=""
//                       columns={this.state.columns.filter(
//                         (item) => !item.hidden,
//                       )}
//                       data={this.state.dataTable}
//                       isLoading={this.state.spinner}
//                       actions={
//                         this.state.navigationAccess.allowDelete
//                           ? this.state.actions
//                           : ""
//                       }
//                       options={{
//                         filtering: false,
//                         paging: false,
//                         search: false,
//                         selection: this.state.navigationAccess.allowDelete,
//                         pageSize: 10,
//                       }}
//                       localization={{
//                         toolbar: {
//                           nRowsSelected: "{0} baris data terpilih",
//                         },
//                         body: {
//                           emptyDataSourceMessage: "Tidak ada data ditampilkan",
//                         },
//                       }}
//                       components={{
//                         Header: (props) => (
//                           <TableHead>
//                             <TableRow>
//                               {this.state.navigationAccess.allowDelete
//                                 ? (
//                                   <TableCell>#</TableCell>
//                                 )
//                                 : (
//                                   ""
//                                 )}
//                               {this.state.columns
//                                 .filter((item) => !item.hidden)
//                                 .map((headCell) => (
//                                   <TableCell
//                                     key={headCell.field}
//                                     sortDirection={
//                                       this.state.orderBy === headCell.field
//                                         ? this.state.order === true
//                                           ? "asc"
//                                           : "desc"
//                                         : false
//                                     }
//                                     align={
//                                       headCell.type === "numeric" ? "right" : ""
//                                     }
//                                   >
//                                     {headCell.sorting === false
//                                       ? (
//                                         headCell.title
//                                       )
//                                       : (
//                                         <TableSortLabel
//                                           active={
//                                             this.state.orderBy === headCell.field
//                                           }
//                                           direction={
//                                             this.state.orderBy === headCell.field
//                                               ? this.state.order === true
//                                                 ? "asc"
//                                                 : "desc"
//                                               : this.state.order === false
//                                                 ? "desc"
//                                                 : "asc"
//                                           }
//                                           onClick={() => this.onRowSort(headCell)}
//                                         >
//                                           {headCell.title}
//                                         </TableSortLabel>
//                                       )}
//                                   </TableCell>
//                                 ))}
//                             </TableRow>
//                           </TableHead>
//                         ),
//                       }}
//                     />
//                   </MuiThemeProvider>
//                 </div>
//               </form>
//             </div>
//             <div className="flex flex-1 items-center justify-between p-12">
//               <Pagination
//                 showQuickJumper={{
//                   goButton: (
//                     <Button variant="contained" color="secondary">
//                       Ok
//                     </Button>
//                   ),
//                 }}
//                 showTotal={(total, range) =>
//                   `${range[0]} - ${range[1]} dari ${total} baris`
//                 }
//                 className="ant-pagination"
//                 onChange={this.handleClick}
//                 current={this.state.currentPage}
//                 total={this.state.countTableData}
//                 locale={localeInfo}
//               />
//             </div>
//           </div>
//         }
//       />
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
// });

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setNavigation: (navigation) => {
//       dispatch(Actions.setNavigation(navigation));
//     },
//     setUser: (user) => {
//       dispatch(AuthActions.setUser(user));
//     },
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(withStyles(styles, { withTheme: true })(withTranslation()(List)));

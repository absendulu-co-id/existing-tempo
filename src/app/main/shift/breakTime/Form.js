// import * as Actions from "../../../store/actions";
// import * as AuthActions from "../../../auth/store/actions";
// import { Button, Grid, MenuItem } from "@material-ui/core";
// import { FieldData } from "./FieldData";
// import {
//   FuseLoading, FusePageCarded,
//   SelectFormsy,
//   SelectSearchFormsy,
//   TextFieldFormsy,
//   TimeFormsy,
// } from "@fuse";
// import { Redirect } from "react-router";

// import { breakTimeConfig } from "./Config";
// import { connect } from "react-redux";
// import { createData, updateData } from "@mid/store/model/action.model";
// import { createDateFromTextValue } from "app/services/dateFunction";
// import { customSelectStyles } from "../../../styles/customSelectStyles";
// import { findNavigationAccess } from "app/services/arrayFunction";
// import { withTranslation } from "react-i18next";
// import Formsy from "formsy-react";
// import HeaderComponent from "../../../components/HeaderComponent";
// import React, { Component } from "react";
// import axios from "axios";
// import history from "../../../services/history";
// import moment from "moment";
// import swal from "sweetalert";
// import withStyles from "@material-ui/core/styles/withStyles";

// const styles = (theme) => ({
//   layoutRoot: {},
// });

// class Form extends Component {
//   state = {
//     success: false,
//     redirect: false,
//     loading: false,
//     data: [],
//     areaData: [],
//     organizationData: [],
//     primaryKey: "breakTimeId",
//   };

//   disableButton = () => {
//     this.setState({
//       isFormValid: false,
//     });
//   };

//   enableButton = () => {
//     this.setState({
//       isFormValid: true,
//     });
//   };

//   handleFormField = async (itemData) => {
//     const token = this.state.token;
//     const data = {};
//     await this.getSelectData(token);
//     if (itemData !== undefined) {
//       this.setState({
//         data: itemData,
//       });
//     } else {
//       FieldData.map((item, index) => {
//         return (data[item.name] = item.value);
//       });
//       this.setState({
//         data,
//       });
//     }
//     this.setState({ loading: !this.state.loading });
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

//   handleInputChangeOrganization = (event) => {
//     this.setState((prevState) => ({
//       data: {
//         ...prevState.data,
//         organizationId: event.organizationId,
//         organizationName: event.organizationName,
//       },
//     }));
//   };

//   handleInputChangeDepartment = (event) => {
//     this.setState((prevState) => ({
//       data: {
//         ...prevState.data,
//         departmentId: event.departmentId,
//         departmentName: event.departmentName,
//       },
//     }));
//   };

//   handleChangeStartTime = (event) => {
//     const time = moment(event).format("HH:mm");
//     function parseTime (s) {
//       const c = s.split(":");
//       return parseInt(c[0]) * 60 + parseInt(c[1]);
//     }
//     if (this.state.data.endTime) {
//       const minutes = parseTime(this.state.data.endTime) - parseTime(time);
//       this.setState((prevState) => ({
//         data: {
//           ...prevState.data,
//           startTime: time,
//           duration: minutes,
//         },
//       }));
//     } else {
//       this.setState((prevState) => ({
//         data: {
//           ...prevState.data,
//           startTime: time,
//         },
//       }));
//     }
//   };

//   handleChangeEndTime = (event) => {
//     const time = moment(event).format("HH:mm");
//     function parseTime (s) {
//       const c = s.split(":");
//       return parseInt(c[0]) * 60 + parseInt(c[1]);
//     }
//     if (this.state.data.startTime) {
//       const minutes = parseTime(time) - parseTime(this.state.data.startTime);
//       this.setState((prevState) => ({
//         data: {
//           ...prevState.data,
//           endTime: time,
//           duration: minutes,
//         },
//       }));
//     } else {
//       this.setState((prevState) => ({
//         data: {
//           ...prevState.data,
//           endTime: time,
//         },
//       }));
//     }
//   };

//   handleSubmit = () => {
//     const href = window.location.pathname.split("/");
//     this.setState({
//       loading: !this.state.loading,
//     });
//     const tokenValidation = this.state.token;
//     const data = {
//       ...this.state.data,
//       organizationId:
//         this.props.user.data.userType !== "mid-admin"
//           ? `${this.props.user.data.defaultOrganizationAccess.organizationId}`
//           : this.state.data.organizationId,
//       organizationName:
//         this.props.user.data.userType !== "mid-admin"
//           ? `${this.props.user.data.defaultOrganizationAccess.organizationName}`
//           : this.state.data.organizationName,
//     };
//     if (tokenValidation !== null || tokenValidation !== undefined) {
//       if (href[3] === "add") {
//         this.props.createData(breakTimeConfig.endPoint, tokenValidation, data);
//       } else if (href[3] === "edit") {
//         this.props.updateData(
//           breakTimeConfig.endPoint,
//           tokenValidation,
//           data,
//           this.state.primaryKeyId,
//         );
//       }
//       this.setState({
//         loading: false,
//       });
//     } else {
//       swal("Error!", "Maaf, terjadi kesalahan.", "error").then((value) => {
//         localStorage.clear();
//         this.setState({
//           redirect: true,
//         });
//       });
//     }
//   };

//   getSelectData = async (token) => {
//     const filterDefaultOrganization =
//       this.props.user.data.userType !== "mid-admin"
//         ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
//         : "";
//     await axios
//       .all([
//         axios
//           .get(
//             `/Organizations?filter[order]=organizationName%20asc${filterDefaultOrganization}`,
//           )
//           .then((res) => {
//             this.setState({ organizationData: res.data.rows });
//           }),
//         axios
//           .get(
//             `/Departments?filter[order]=departmentName%20asc${filterDefaultOrganization}`,
//           )
//           .then((res) => {
//             this.setState({ departmentData: res.data.rows });
//           }),
//       ])
//       .catch((err) => {
//         this.setState({ loading: true });
//       });
//   };

//   componentDidMount () {
//     this.setState({ loading: !this.state.loading });
//     const href = window.location.pathname.split("/");
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

//             this.setState({ token });
//             if (href[3] === "edit") {
//               if (!navigationAccess.allowEdit) {
//                 this.setState({ loading: true });
//                 swal(
//                   "Error!",
//                   "Maaf, Anda tidak memiliki Akses.",
//                   "error",
//                 ).then(() => {
//                   history.goBack();
//                 });
//               } else {
//                 const id = href[4];
//                 this.setState({ primaryKeyId: id });
//                 axios
//                   .get(`/${breakTimeConfig.endPoint}/${id}`)
//                   .then((res) => {
//                     this.handleFormField(res.data);
//                   })
//                   .catch(() => {
//                     this.setState({ loading: true });
//                   });
//               }
//             } else {
//               if (!navigationAccess.allowAdd) {
//                 this.setState({ loading: true });
//                 swal(
//                   "Error!",
//                   "Maaf, Anda tidak memiliki Akses.",
//                   "error",
//                 ).then(() => {
//                   history.goBack();
//                 });
//               } else {
//                 this.handleFormField();
//               }
//             }
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
//     const { classes, t, model } = this.props;
//     const { redirect, loading } = this.state;
//     const href = window.location.pathname.split("/");
//     const title = t(href[1]);
//     const title2 = t(href[2]);
//     document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;
//     const title3 = href[3] === "add" ? "Tambah " + title2 : "Ubah " + title2;

//     if (redirect) {
//       return <Redirect to="/login" />;
//     } else if (loading || model.loading) {
//       return <FuseLoading />;
//     }

//     return (
//       <FusePageCarded
//         classes={{
//           root: classes.layoutRoot,
//         }}
//         header={
//           <HeaderComponent
//             breadcrumbs={[title, title2, title3]}
//             titlePage={title2}
//           />
//         }
//         contentToolbar={
//           <div className="px-24">
//             <h2>
//               {href[3] === "add" ? "Tambah" : "Edit"} {title2}
//             </h2>
//           </div>
//         }
//         content={
//           <Formsy
//             onValidSubmit={this.handleSubmit}
//             onValid={this.enableButton}
//             onInvalid={this.disableButton}
//             className="flex flex-col justify-center w-full"
//           >
//             <div className="p-24">
//               <Grid container spacing={2}>
//                 {FieldData.map((item, index) => {
//                   if (
//                     item.type === "text" ||
//                     item.type === "password" ||
//                     item.type === "number"
//                   ) {
//                     return (
//                       <Grid item xs={12} sm={6} key={index}>
//                         <TextFieldFormsy
//                           variant="outlined"
//                           type={item.type}
//                           name={item.name}
//                           label={item.label}
//                           onChange={this.handleInputChange}
//                           value={this.state.data[item.name]}
//                           multiline={item.multiline}
//                           rows={item.rows}
//                           rowsMax={item.rowsMax}
//                           validations={item.validations}
//                           validationErrors={item.validationErrors}
//                           InputLabelProps={{
//                             shrink: item.type === "date" ? true : undefined,
//                           }}
//                           required={item.required}
//                         />
//                       </Grid>
//                     );
//                   } else if (item.type === "select") {
//                     if (item.option !== null) {
//                       return (
//                         <Grid item xs={12} sm={6} key={index}>
//                           <SelectFormsy
//                             name={item.name}
//                             label={item.label}
//                             value={[this.state.data[item.name]]}
//                             validations={item.validations}
//                             validationErrors={item.validationErrors}
//                             variant="outlined"
//                             onChange={this.handleInputChange}
//                             required={item.required}
//                           >
//                             <MenuItem value="">
//                               {"Pilih " + item.label}
//                             </MenuItem>
//                             {item.option.map((item, index) => {
//                               return (
//                                 <MenuItem key={index} value={item.value}>
//                                   {item.label}
//                                 </MenuItem>
//                               );
//                             })}
//                           </SelectFormsy>
//                         </Grid>
//                       );
//                     } else if (item.name === "departmentId") {
//                       return (
//                         <Grid item xs={12} sm={6} key={index}>
//                           <SelectSearchFormsy
//                             value={
//                               this.state.data[item.name] ? this.state.data : ""
//                             }
//                             placeholder={`Pilih ${item.label}`}
//                             name={item.name}
//                             getOptionLabel={(option) => option.departmentName}
//                             getOptionValue={(option) => option.departmentId}
//                             options={this.state.departmentData}
//                             onChange={this.handleInputChangeDepartment}
//                             styles={customSelectStyles}
//                             isSearchable={true}
//                             isLoading={this.state.spinner}
//                             validations={item.validations}
//                             validationErrors={item.validationErrors}
//                             required={item.required}
//                           />
//                         </Grid>
//                       );
//                     } else if (
//                       item.name === "organizationId" &&
//                       this.props.user.data.userType === "mid-admin"
//                     ) {
//                       return (
//                         <Grid item xs={12} sm={6} key={index}>
//                           <SelectSearchFormsy
//                             value={
//                               this.state.data[item.name] ? this.state.data : ""
//                             }
//                             placeholder={`Pilih ${item.label}`}
//                             name={item.name}
//                             getOptionLabel={(option) => option.organizationName}
//                             getOptionValue={(option) => option.organizationId}
//                             options={this.state.organizationData}
//                             onChange={this.handleInputChangeOrganization}
//                             styles={customSelectStyles}
//                             isSearchable={true}
//                             isLoading={this.state.spinner}
//                             validations={item.validations}
//                             validationErrors={item.validationErrors}
//                             required={item.required}
//                           />
//                         </Grid>
//                       );
//                     } else {
//                       return "";
//                     }
//                   } else if (item.type === "time") {
//                     if (item.name === "startTime") {
//                       return (
//                         <Grid item xs={12} sm={6} key={index}>
//                           <TimeFormsy
//                             inputVariant="outlined"
//                             autoComplete="off"
//                             name={item.name}
//                             label={item.label}
//                             value={createDateFromTextValue(
//                               this.state.data[item.name],
//                             )}
//                             validations={item.validations}
//                             validationErrors={item.validationErrors}
//                             required={item.required}
//                             onChange={this.handleChangeStartTime}
//                           />
//                         </Grid>
//                       );
//                     } else if (item.name === "endTime") {
//                       return (
//                         <Grid item xs={12} sm={6} key={index}>
//                           <TimeFormsy
//                             inputVariant="outlined"
//                             autoComplete="off"
//                             name={item.name}
//                             label={item.label}
//                             value={createDateFromTextValue(
//                               this.state.data[item.name],
//                             )}
//                             validations={item.validations}
//                             validationErrors={item.validationErrors}
//                             required={item.required}
//                             onChange={this.handleChangeEndTime}
//                           />
//                         </Grid>
//                       );
//                     } else {
//                       return "";
//                     }
//                   } else {
//                     return "";
//                   }
//                 })}
//               </Grid>
//               <Button
//                 variant="contained"
//                 style={{ marginTop: "2%" }}
//                 color="default"
//                 onClick={() => history.goBack()}
//               >
//                 Batal
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 disabled={!this.state.isFormValid}
//                 style={{ marginTop: "2%", marginLeft: "1%" }}
//                 onClick={() => this.handleSubmit()}
//               >
//                 {" "}
//                 Simpan{" "}
//               </Button>
//             </div>
//           </Formsy>
//         }
//       />
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
//   model: state.model,
// });

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setNavigation: (navigation) => {
//       dispatch(Actions.setNavigation(navigation));
//     },
//     setUser: (user) => {
//       dispatch(AuthActions.setUser(user));
//     },
//     createData: (endPoint, token, data) => {
//       dispatch(createData(endPoint, token, data));
//     },
//     updateData: (endPoint, token, data, id) => {
//       dispatch(updateData(endPoint, token, data, id));
//     },
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(withStyles(styles, { withTheme: true })(withTranslation()(Form)));

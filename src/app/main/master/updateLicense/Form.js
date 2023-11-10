// import { Button } from "@material-ui/core";
// import { FuseLoading, FusePageCarded } from "@fuse";
// import { Redirect } from "react-router";
// import { withTranslation } from "react-i18next";
// import HeaderComponent from "../../../components/HeaderComponent";
// import React, { Component } from "react";
// import axios from "axios";
// import history from "../../../services/history";
// import swal from "sweetalert";
// import withStyles from "@material-ui/core/styles/withStyles";

// const styles = (theme) => ({
//   layoutRoot: {},
// });

// class Form extends Component {
//   state = {
//     success: false,
//     loading: false,
//     file: null,
//   };

//   handleSubmit = () => {
//     this.setState({
//       loading: true,
//     });
//     const formdata = new FormData();
//     formdata.append("files", this.state.file);
//     axios
//       .post("/update-license", formdata)
//       .then(async (res) => {
//         this.setState({
//           loading: false,
//         });
//         await swal("Berhasil!", "Data berhasil disimpan", "success");
//         history.goBack();
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   componentDidMount () {
//     this.setState({ loading: false });
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
//             <h2>{title2}</h2>
//           </div>
//         }
//         content={
//           <>
//             <div className="p-24">
//               <input
//                 accept=".txt"
//                 className={classes.input}
//                 style={{ display: "none" }}
//                 id="raised-button-file"
//                 onChange={(event) => {
//                   this.setState({
//                     file: event.target.files[0],
//                   });
//                 }}
//                 type="file"
//               />
//               <label htmlFor="raised-button-file">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   component="span"
//                   className={classes.button}
//                 >
//                   Upload file
//                 </Button>
//               </label>
//               <span className="ml-5 font-bold">
//                 {this.state.file
//                   ? this.state.file.name
//                   : "Tidak ada file yang dipilih"}{" "}
//               </span>
//             </div>
//             <div className="p-24">
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
//                 disabled={!this.state.file}
//                 style={{ marginTop: "2%", marginLeft: "1%" }}
//                 onClick={() => this.handleSubmit()}
//               >
//                 {" "}
//                 Simpan{" "}
//               </Button>
//             </div>
//           </>
//         }
//       />
//     );
//   }
// }

// export default withStyles(styles, { withTheme: true })(withTranslation()(Form));

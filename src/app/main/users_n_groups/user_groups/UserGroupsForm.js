import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { createData, updateData } from "../../../store/actions/globalAction";
import { materialTableTheme } from "../../../styles/materialTableTheme";
import { userGroupConfig } from "./Config";
import { FieldData, Menu } from "./FieldData";
import { CheckboxFormsy, FuseLoading, FusePageCarded, SelectFormsy, TextFieldFormsy } from "@fuse";
import { Button, Grid, MenuItem, Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Formsy from "formsy-react";
import { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import swal from "sweetalert";

const styles = () => ({
  layoutRoot: {},
});

class UserGroupsForm extends Component {
  state = {
    success: false,
    redirect: false,
    loading: false,
    userGroupName: null,
    data: [],
    dataMenu: [],
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

  handleFormField = (itemData) => {
    const data = {};
    const dataMenu = {};
    if (itemData !== undefined) {
      const responseMenu = JSON.parse(itemData.menujson);
      const responseOtherAccess = [];
      this.setState({
        userGroupName: itemData.userGroupName,
        data: itemData,
        otherAccess: responseOtherAccess,
      });
      responseMenu.map((item) => {
        return item.children.map((item) => {
          if (item.children !== undefined) {
            item.children.map((item) => {
              if (item.access !== undefined) {
                item.access.map((item) => {
                  return (dataMenu[item.id] = true);
                });
              }
              return (dataMenu[item.id] = true);
            });
          }
          return (dataMenu[item.id] = true);
        });
      });
    } else {
      FieldData.map((item) => {
        return (data[item.name] = item.value);
      });

      Menu().map((item) => {
        return item.children.map((item) => {
          if (item.children !== undefined) {
            item.children.map((item) => {
              if (item.access !== undefined) {
                item.access.map((item) => {
                  return (dataMenu[item.id] = item.status);
                });
              }
              return (dataMenu[item.id] = item.status);
            });
          }
          return (dataMenu[item.id] = item.status);
        });
      });
      this.setState({
        data,
      });
    }
    this.setState({
      dataMenu,
      loading: false,
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

  handleCheckboxChange = (event) => {
    const id = event.target.id;
    const checked = event.target.checked;
    this.setState((prevState) => ({
      dataMenu: {
        ...prevState.dataMenu,
        [id]: checked,
      },
    }));
  };

  handlePermission = () => {
    const tmp = [];
    Menu(this.state.dataMenu)
      .filter((item) => item.status)
      .map((item) => {
        const tmp_ = {};
        tmp_.id = item.id;
        tmp_.title = item.title;
        tmp_.type = item.type;
        const t_children = [];
        item.children
          .filter((item2) => item2.status === true)
          .map((item2) => {
            const _t = {};
            if (item2.auth) {
              _t.auth = item2.auth;
            }
            _t.id = item2.id;
            _t.title = item2.title;
            _t.type = item2.type;
            _t.icon = item2.icon;
            if (item2.url !== undefined) {
              _t.url = item2.url;
            }
            const t_access = [];

            if (item2.access !== undefined && item2.url === undefined) {
              item2.access.map((item3) => {
                if (item3.status) {
                  const access = {};
                  access.id = item3.id;
                  access.title = item3.title;
                  t_access.push(access);
                }
                return (_t.access = t_access);
              });
            } else if (item2.url === undefined) {
              const t_children2 = [];
              item2.children.map((item3) => {
                if (item3.status === true) {
                  const children = {};
                  if (item3.auth) {
                    children.auth = item3.auth;
                  }
                  children.id = item3.id;
                  children.title = item3.title;
                  children.type = item3.type;
                  children.icon = item3.icon;
                  children.url = item3.url;

                  const t_access2 = [];
                  if (item3.access !== undefined) {
                    item3.access.map((item4) => {
                      if (item4.status) {
                        const access = {};
                        access.id = item4.id;
                        access.title = item4.title;
                        t_access2.push(access);
                      }
                      return (children.access = t_access2);
                    });
                  }
                  t_children2.push(children);
                }
                return (_t.children = t_children2);
              });
            }
            return t_children.push(_t);
          });
        const findDashboard = t_children.findIndex((item) => item.id === "dashboard");
        if (findDashboard === -1) {
          const dataDashboard = {
            icon: "dashboard",
            id: "dashboard_readonly",
            status: false,
            title: "Dashboard",
            type: "collapse",
            children: [
              {
                icon: "fiber_manual_record",
                id: "summary_dashboard_readonly",
                status: undefined,
                title: "Ringkasan",
                type: "item",
                url: "/dashboard/summary",
              },
            ],
          };
          t_children.splice(0, 0, dataDashboard);
        } else {
          const summaryIndex = t_children[findDashboard].children.findIndex((item) => item.id === "summary_dashboard");
          if (summaryIndex === -1) {
            t_children[findDashboard].children.splice(0, 0, {
              icon: "fiber_manual_record",
              id: "summary_dashboard_readonly",
              status: undefined,
              title: "Ringkasan",
              type: "item",
              url: "/dashboard/summary",
            });
          }
        }
        tmp_.children = t_children;

        return tmp.push(tmp_);
      });

    const obj = JSON.stringify(tmp);
    return obj;
  };

  handleSubmit = async () => {
    this.setState({
      loading: !this.state.loading,
    });
    const href = window.location.pathname.split("/");

    const menujson = this.handlePermission();
    const data = {
      ...this.state.data,
      menujson,
    };

    if (href[3] === "add") {
      await this.props.createData(userGroupConfig.endPoint, data);
    } else if (href[3] === "edit") {
      await this.props.updateData(userGroupConfig.endPoint, data, this.state.id);
    }
  };

  async componentDidMount() {
    this.setState({ loading: !this.state.loading });
    const href = window.location.pathname.split("/");

    if (href[3] === "edit") {
      if (!this.props.access.editRule) {
        this.setState({ loading: true });
        await swal("Error!", "Maaf, Anda tidak memiliki Akses.", "error");
        history.goBack();
      } else {
        const id = href[4];
        this.setState({ id });
        const allData = this.props.globalData.allData[userGroupConfig.endPoint];
        if (allData) {
          const filter = allData.filter((row) => row[userGroupConfig.primaryKey] == id)[0];
          this.handleFormField(filter);
        } else {
          axios
            .get(`/${userGroupConfig.endPoint}/${id}`)
            .then((res) => {
              this.handleFormField(res.data);
            })
            .catch((err) => {
              this.setState({ loading: true });
            });
        }
      }
    } else if (href[3] === "add") {
      if (!this.props.access.editRule) {
        this.setState({ loading: true });
        await swal("Error!", "Maaf, Anda tidak memiliki Akses.", "error");
        history.goBack();
      } else {
        this.handleFormField();
      }
    } else {
      this.handleFormField();
    }
  }

  render() {
    const { classes, t, globalData } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;
    const title3 = href[3] === "add" ? "Tambah " + title2 : "Ubah " + title2;

    if (redirect) {
      return <Redirect to="/login" />;
    } else if (loading && globalData.loadingForm) {
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
                  if (item.type === "text") {
                    return (
                      <Grid item xs={12} sm={6} key={index}>
                        <TextFieldFormsy
                          variant="outlined"
                          type={item.type}
                          name={item.name}
                          label={item.label}
                          onChange={this.handleInputChange}
                          value={this.state.data[item.name]}
                          multiline={item.multiline}
                          rows={item.rows}
                          rowsMax={item.rowsMax}
                          validations={item.validations}
                          validationErrors={item.validationErrors}
                          required
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
                            value={this.state.data[item.name] ? [this.state.data[item.name]] : ""}
                            validations={item.validations}
                            validationErrors={item.validationErrors}
                            variant="outlined"
                            onChange={this.handleInputChange}
                            required
                          >
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
                      return "";
                    }
                  } else {
                    return "";
                  }
                })}
              </Grid>
              <h2 style={{ marginTop: "2%" }}>Daftar Hak Akses</h2>
              <MuiThemeProvider theme={materialTableTheme}>
                <Table size="small" padding="checkbox">
                  <TableBody key={1}>
                    {Menu().map((item) => {
                      return item.children.map((item, index) => {
                        if (item.children !== undefined) {
                          return [
                            <TableRow key={index} style={{ backgroundColor: "#ecf0f1" }}>
                              <TableCell padding="checkbox" size="small" component="th" scope="row" key={index}>
                                <div className="pl-10">
                                  <CheckboxFormsy
                                    key={item.id}
                                    className="my-16"
                                    id={item.id}
                                    name={item.id}
                                    value={
                                      this.state.dataMenu[item.id] === undefined ? false : this.state.dataMenu[item.id]
                                    }
                                    label={item.title}
                                    onChange={this.handleCheckboxChange}
                                  />
                                </div>
                              </TableCell>
                              <TableCell padding="checkbox" size="small" align="center"></TableCell>
                              <TableCell padding="checkbox" size="small" align="center"></TableCell>
                            </TableRow>,
                            item.children.map((item, index) => {
                              if (item.access !== undefined) {
                                return [
                                  <TableRow key={index + "a"} padding="checkbox">
                                    <div className="pl-24">
                                      <CheckboxFormsy
                                        key={item.id}
                                        className="my-16"
                                        id={item.id}
                                        name={item.id}
                                        value={
                                          this.state.dataMenu[item.id] === undefined
                                            ? false
                                            : this.state.dataMenu[item.id]
                                        }
                                        label={item.title}
                                        onChange={this.handleCheckboxChange}
                                      />
                                    </div>
                                  </TableRow>,
                                  <TableRow key={index + "b"}>
                                    {item.access.map((item) => {
                                      // bug slow
                                      return (
                                        <CheckboxFormsy
                                          key={item.id}
                                          className="ml-68"
                                          id={item.id}
                                          name={item.id}
                                          value={
                                            this.state.dataMenu[item.id] === undefined
                                              ? false
                                              : this.state.dataMenu[item.id]
                                          }
                                          label={item.title}
                                          onChange={this.handleCheckboxChange}
                                        />
                                      );
                                    })}
                                  </TableRow>,
                                ];
                              }
                              return (
                                <div className="pl-24" key={index + "c"}>
                                  <CheckboxFormsy
                                    key={item.id}
                                    className="my-16"
                                    id={item.id}
                                    name={item.id}
                                    value={
                                      this.state.dataMenu[item.id] === undefined ? false : this.state.dataMenu[item.id]
                                    }
                                    label={item.title}
                                    onChange={this.handleCheckboxChange}
                                  />
                                </div>
                              );
                            }),
                          ];
                        }
                        return (
                          <TableRow key={index}>
                            <TableCell padding="checkbox" size="small" component="th" scope="row">
                              <div className="pl-10">
                                <CheckboxFormsy
                                  key={item.id}
                                  className="my-16"
                                  id={item.id}
                                  name={item.id}
                                  value={
                                    this.state.dataMenu[item.id] === undefined ? false : this.state.dataMenu[item.id]
                                  }
                                  label={item.title}
                                  onChange={this.handleCheckboxChange}
                                />
                              </div>
                            </TableCell>
                            <TableCell padding="checkbox" size="small" align="center"></TableCell>
                            <TableCell padding="checkbox" size="small" align="center"></TableCell>
                          </TableRow>
                        );
                      });
                    })}
                  </TableBody>
                </Table>
              </MuiThemeProvider>
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
                Simpan
              </Button>
            </div>
          </Formsy>
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    navigation: state.fuse.navigation,
    globalData: state.globalReducer,
    access: state.globalReducer.pageRule,
  };
};
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
    updateData: (endPoint, data, userGroupId) => {
      dispatch(updateData(endPoint, data, userGroupId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(withTranslation()(UserGroupsForm)));

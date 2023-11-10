import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { workflowNodeConfig } from "./Config";
import { FieldData } from "./FieldData";
import { FuseLoading, FusePageCarded, SelectFormsy, TextFieldFormsy } from "@fuse";
import { Button, Grid, MenuItem, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { WithStyles, withStyles } from "@material-ui/styles";
import { createData, updateData } from "@mid/store/model/action.model";
import { ModelState } from "@mid/store/model/reducer.model";
import { Area, Organization, Workflownode, Workflowrole } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { UserState } from "app/auth/store/reducers/user.reducer";
import { RootState } from "app/store";
import { GlobalReducerStatePageRule } from "app/store/reducers/global.reducer";
import axios from "axios";
import Formsy from "formsy-react";
import { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import swal from "sweetalert";

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
  data: {
    workflowNodeApprover: Workflownode[];
    workflowNodeNotifier: Workflownode[];
    organizationId?: number;
    organizationName?: string;
  };
  areaData: Area[];
  organizationData: Organization[];
  workflowRoleData: Workflowrole[];
  primaryKey: string;
  isFormValid: boolean;
  primaryKeyId?: string;
}

const styles = (theme) => ({
  layoutRoot: {},
});

class Form extends Component<Props, States> {
  state: States = {
    success: false,
    redirect: false,
    loading: false,
    data: { workflowNodeApprover: [], workflowNodeNotifier: [] },
    areaData: [],
    organizationData: [],
    workflowRoleData: [],
    primaryKey: "workflowRoleId",
    isFormValid: false,
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
    const data: any = {};
    await this.getSelectData();
    if (itemData !== undefined) {
      const notifier = itemData.workflowNodeNotifier;
      const approver = itemData.workflowNodeApprover;
      this.setState({
        data: {
          ...itemData,
          workflowNodeNotifier: notifier,
          workflowNodeApprover: approver,
        },
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

  handleInputChangeOrganization = (event) => {
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        organizationId: event.organizationId,
        organizationName: event.organizationName,
      },
    }));
  };

  handleChangeMultipleSelect = (newValue, name) => {
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        [name]: newValue,
      },
    }));
  };

  handleSubmit = () => {
    const href = window.location.pathname.split("/");
    this.setState({
      loading: !this.state.loading,
    });
    const data = {
      ...this.state.data,
      organizationId:
        this.props.user.data.userType !== "mid-admin"
          ? `${this.props.user.data.defaultOrganizationAccess.organizationId}`
          : this.state.data.organizationId,
      organizationName:
        this.props.user.data.userType !== "mid-admin"
          ? `${this.props.user.data.defaultOrganizationAccess.organizationName}`
          : this.state.data.organizationName,
    };
    if (href[3] === "add") {
      this.props.createData(workflowNodeConfig.endPoint, data);
    } else if (href[3] === "edit") {
      this.props.updateData(workflowNodeConfig.endPoint, data, this.state.primaryKeyId);
    }
    this.setState({
      loading: false,
    });
  };

  getSelectData = async () => {
    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin"
        ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
        : "";

    const res = await Promise.all([
      axios.get(`/Organizations?filter[order]=organizationName%20asc${filterDefaultOrganization}`),
      axios.get(`/WorkflowRole?filter[order]=workflowRoleName%20asc${filterDefaultOrganization}`),
    ]);

    this.setState({
      loading: true,
      organizationData: res[0].data.rows,
      workflowRoleData: res[1].data.rows,
    });
  };

  async componentDidMount() {
    this.setState({ loading: !this.state.loading });
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

        const res = await axios.get(`/${workflowNodeConfig.endPoint}/${id}`);
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
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;
    const title3 = href[3] === "add" ? "Tambah " + title2 : "Ubah " + title2;

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
                  if (
                    item.type === "text" ||
                    item.type === "password" ||
                    item.type === "date" ||
                    item.type === "number"
                  ) {
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
                          minRows={item.rows}
                          maxRows={item.rowsMax}
                          validations={item.validations}
                          validationErrors={item.validationErrors}
                          InputLabelProps={{
                            shrink: item.type === "date" ? true : undefined,
                          }}
                          required={item.required}
                          disabled={item.disabled}
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
                            value={this.state.data[item.name]}
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
                    }
                    if (item.name === "workflowNodeApprover") {
                      const value =
                        typeof this.state.data.workflowNodeApprover === "string"
                          ? JSON.parse(this.state.data.workflowNodeApprover)
                          : this.state.data.workflowNodeApprover;
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <Autocomplete
                            fullWidth
                            multiple
                            id={item.name}
                            options={this.state.workflowRoleData.filter((option) =>
                              value.some((item) => item.workflowRoleId === option.workflowRoleId),
                            )}
                            value={value}
                            onChange={(event, newValue) => this.handleChangeMultipleSelect(newValue, item.name)}
                            getOptionLabel={(option) => option.workflowRoleName}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={item.label}
                                style={{
                                  width: "100%",
                                }}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                      );
                    } else if (item.name === "workflowNodeNotifier") {
                      const value =
                        typeof this.state.data.workflowNodeNotifier === "string"
                          ? JSON.parse(this.state.data.workflowNodeNotifier)
                          : this.state.data.workflowNodeNotifier;
                      return (
                        <Grid item xs={12} sm={6} key={index}>
                          <Autocomplete
                            fullWidth
                            multiple
                            id={item.name}
                            options={this.state.workflowRoleData.filter(
                              (option) =>
                                value.findIndex((item) => item.workflowRoleId === option.workflowRoleId) === -1,
                            )}
                            value={value}
                            onChange={(event, newValue) => this.handleChangeMultipleSelect(newValue, item.name)}
                            getOptionLabel={(option) => option.workflowRoleName}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={item.label}
                                style={{
                                  width: "100%",
                                }}
                                variant="outlined"
                              />
                            )}
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

const mapStateToProps = (state: RootState) => ({
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
    updateData: (endPoint, data, id) => {
      dispatch(updateData(endPoint, data, id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(withTranslation()(Form)));

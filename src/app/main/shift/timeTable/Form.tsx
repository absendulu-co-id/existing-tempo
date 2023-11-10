import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { timeTableConfig } from "./Config";
import { tabFieldData } from "./FieldData";
import { FuseLoading, FusePageCarded, TextFieldFormsy, TimeFormsy } from "@fuse";
import { Icon } from "@iconify-icon/react";
import {
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  Grid,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { createData, updateData } from "@mid/store/model/action.model";
import { createDateFromTextValue } from "app/services/dateFunction";
import { RootState } from "app/store";
import axios from "axios";
import Formsy from "formsy-react";
import moment from "moment";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import swal from "sweetalert";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  isFormValid: boolean;
  redirect: boolean;
  loading: boolean;
  data: any;
  primaryKey: string;
  isBreakEnabled: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    layoutRoot: {},
  });

class Form extends Component<Props, States> {
  state: States = {
    isFormValid: false,
    redirect: false,
    loading: true,
    data: {},
    primaryKey: "timeTableId",
    isBreakEnabled: true,
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

  handleChangeTime = (fieldName: string, event: moment.Moment) => {
    const time = moment(event).format("HH:mm");
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        [fieldName]: time,
      },
    }));
  };

  handleBreakCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ isBreakEnabled: event.target.checked });
  };

  handleSubmit = async () => {
    const href = window.location.pathname.split("/");
    this.setState({
      loading: true,
    });

    const data = {
      ...this.state.data,
      organizationId: this.state.data.organizationId,
      organizationName: this.state.data.organizationName,
    };

    if (!this.state.isBreakEnabled) {
      data.breakIn = "00:00";
      data.breakInStart = "00:00";
      data.breakOut = "00:00";
      data.breakOutEnd = "00:00";
    }

    if (href[3] === "add") {
      await this.props.createData(timeTableConfig.endPoint, data);
    } else if (href[3] === "edit") {
      await this.props.updateData(timeTableConfig.endPoint, data, this.state.primaryKey);
    }
    this.setState({
      loading: false,
    });
  };

  async componentDidMount() {
    const href = window.location.pathname.split("/");
    const { addRule, editRule } = this.props.access;

    if ((href[3] === "edit" && !editRule) || !addRule) {
      this.setState({ loading: true });
      await swal("Error!", "Maaf, Anda tidak memiliki Akses.", "error");
      history.goBack();

      return;
    }

    if (href[3] === "edit") {
      const id = href[4];
      this.setState({ primaryKey: id });

      const res = await axios.get(`/${timeTableConfig.endPoint}/${id}`);

      if (
        res.data &&
        res.data.breakIn == "00:00:00" &&
        res.data.breakInStart == "00:00:00" &&
        res.data.breakOut == "00:00:00" &&
        res.data.breakOutEnd == "00:00:00"
      ) {
        this.setState({
          isBreakEnabled: false,
        });
      }

      this.setState({
        data: res.data,
      });
    } else {
      const data = {};
      tabFieldData.forEach((item) => {
        item.fieldData.map((item) => {
          return (data[item.name] = item.value);
        });
        item.fieldData2.map((item) => {
          return (data[item.name] = item.value);
        });
        item.fieldData3.map((item) => {
          return (data[item.name] = item.value);
        });
      });

      this.setState({
        data,
      });
    }

    this.setState({ loading: false });
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
            onValid={() => this.setState({ isFormValid: true })}
            onInvalid={() => this.setState({ isFormValid: false })}
            className="flex flex-col justify-center w-full"
          >
            <div className="p-24">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextFieldFormsy
                    variant="outlined"
                    type="text"
                    name="timeTableName"
                    label="Nama"
                    onChange={this.handleInputChange}
                    value={this.state.data.timeTableName}
                    validations="isExisty"
                    validationErrors={{
                      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextFieldFormsy
                    variant="outlined"
                    type="text"
                    name="timeTableId"
                    label="Kode"
                    onChange={this.handleInputChange}
                    value={this.state.data.timeTableId}
                    validations="isAlphanumeric"
                    validationErrors={{
                      isAlphanumeric: "Field Harus diisi dan hanya boleh berupa huruf dan angka",
                    }}
                    required
                  />
                </Grid>
              </Grid>

              <hr className="my-16" />
              <Typography component="h2" variant="h6" className="mb-16">
                <Icon icon="ic:outline-punch-clock" />
                Clock In
              </Typography>

              <Grid container spacing={2}>
                {tabFieldData[0].fieldData.map((item, index) => {
                  if (item.type === "time") {
                    const value = this.state.data[item.name]
                      ? createDateFromTextValue(this.state.data[item.name])
                      : createDateFromTextValue(item.value);
                    return (
                      <Grid item xs={12} sm={4} key={index}>
                        <TimeFormsy
                          inputVariant="outlined"
                          autoComplete="off"
                          name={item.name}
                          label={item.label}
                          value={value}
                          validations={item.validations}
                          validationErrors={item.validationErrors}
                          required={item.required}
                          onChange={(evt) => this.handleChangeTime(item.name, evt)}
                        />
                      </Grid>
                    );
                  } else {
                    return "";
                  }
                })}
              </Grid>

              <hr className="my-16" />
              <Typography component="h2" variant="h6" className="mb-16">
                <span style={{ display: "inline-flex", width: "20px" }}>
                  <Icon icon="ic:outline-punch-clock" style={{ position: "relative" }} />
                  <Icon
                    icon="ic:baseline-horizontal-rule"
                    style={{
                      position: "relative",
                      transform: "rotate(45deg)",
                      left: "-20px",
                    }}
                  />
                </span>
                Clock Out
              </Typography>

              <Grid container spacing={2}>
                {tabFieldData[0].fieldData2.map((item, index) => {
                  if (item.type === "time") {
                    const value = this.state.data[item.name]
                      ? createDateFromTextValue(this.state.data[item.name])
                      : createDateFromTextValue(item.value);
                    return (
                      <Grid item xs={12} sm={4} key={index}>
                        <TimeFormsy
                          inputVariant="outlined"
                          autoComplete="off"
                          name={item.name}
                          label={item.label}
                          value={value}
                          validations={item.validations}
                          validationErrors={item.validationErrors}
                          required={item.required}
                          onChange={(evt) => this.handleChangeTime(item.name, evt)}
                        />
                      </Grid>
                    );
                  } else {
                    return "";
                  }
                })}
              </Grid>

              <hr className="my-16" />
              <Typography component="h2" variant="h6" className="mb-8">
                <Icon icon="ic:baseline-coffee" />
                Istirahat
              </Typography>

              <FormControlLabel
                control={<Checkbox checked={this.state.isBreakEnabled} onChange={this.handleBreakCheckbox} />}
                label="Pakai Istirahat"
                className="mb-16"
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={3} lg={3}>
                  <TimeFormsy
                    inputVariant="outlined"
                    autoComplete="off"
                    name="breakInStart"
                    label="Batas Mulai Istirahat"
                    value={moment(this.state.data.breakInStart ?? "11:30", "HH:mm").toDate()}
                    validations="isExisty"
                    validationErrors={{
                      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
                    }}
                    onChange={(e) => this.handleChangeTime("breakInStart", e)}
                    disabled={!this.state.isBreakEnabled}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <TimeFormsy
                    inputVariant="outlined"
                    autoComplete="off"
                    name="breakIn"
                    label="Mulai Istirahat"
                    value={moment(this.state.data.breakIn ?? "12:00", "HH:mm").toDate()}
                    validations="isExisty"
                    validationErrors={{
                      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
                    }}
                    onChange={(e) => this.handleChangeTime("breakIn", e)}
                    disabled={!this.state.isBreakEnabled}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <TimeFormsy
                    inputVariant="outlined"
                    autoComplete="off"
                    name="breakOut"
                    label="Akhir Istirahat"
                    value={moment(this.state.data.breakOut ?? "13:00", "HH:mm").toDate()}
                    validations="isExisty"
                    validationErrors={{
                      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
                    }}
                    onChange={(e) => this.handleChangeTime("breakOut", e)}
                    disabled={!this.state.isBreakEnabled}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <TimeFormsy
                    inputVariant="outlined"
                    autoComplete="off"
                    name="breakOutEnd"
                    label="Batas Akhir Istirahat"
                    value={moment(this.state.data.breakOutEnd ?? "13:30", "HH:mm").toDate()}
                    validations="isExisty"
                    validationErrors={{
                      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
                    }}
                    onChange={(e) => this.handleChangeTime("breakOutEnd", e)}
                    disabled={!this.state.isBreakEnabled}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                style={{ marginTop: "16px" }}
                color="default"
                onClick={() => history.goBack()}
              >
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
  createData,
  updateData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(Form)));

import * as types from "@mid/components/field/types";
import * as fieldCreator from "@mid/helper/fieldCreator.helper";
import * as Model from "@mid/store/model/action.model";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import { data } from "@mid/components/config/general.config";
import { addField, clearField, getOptions, resetField, setValue } from "@mid/store/formMaker/action.formMaker";
import HeaderComponent from "app/components/HeaderComponent";
import history from "app/services/history";
import { RootState } from "app/store";
import Formsy from "formsy-react";
import { GeneralConfig } from "interface/general-config";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {
  location;
}

interface States {
  success: boolean;
  redirect: boolean;
  loading: boolean;
  data: any;
  userGroupData: any[];
  isFormValid: boolean;
  generalConfig: GeneralConfig;
}

const styles = (theme) => ({
  layoutRoot: {},
});

class Form extends React.Component<Props, States> {
  state: States = {
    success: false,
    redirect: false,
    loading: true,
    data: {},
    userGroupData: [],
    isFormValid: true,
    generalConfig: {
      primaryKey: "",
      model: "",
      endPoint: "",
      defaultOrder: "",
      fields: [],
    },
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

  async componentDidMount() {
    const pathUrl = window.location.pathname.split("/");
    const generalConfig = data[`/${pathUrl[1]}/${pathUrl[2]}`] as GeneralConfig;

    this.props.initModel({
      model: generalConfig.model,
      endPoint: generalConfig.endPoint,
      defaultOrder: generalConfig.defaultOrder,
      primaryKey: generalConfig.primaryKey,
    });
    this.props.clearField();
    this.props.resetField();
    this.props.clearFilter();

    if (generalConfig.fields != null) {
      for (const item of generalConfig.fields) {
        if (item.allowInsert == undefined || item.allowInsert) {
          if (item.auth) {
            if (item.auth.includes(this.props.role)) {
              this.props.addField(item);
              if (
                (item.fieldType === types.TYPE_FIELD_SELECT ||
                  item.fieldType === types.TYPE_FIELD_AUTOCOMPLETE ||
                  item.fieldType === types.TYPE_FIELD_SELECT_MULTIPLE) &&
                item.dataSource === "API"
              ) {
                void this.props.getOptions(item);
              }
            }
          } else {
            this.props.addField(item);
            if (
              (item.fieldType === types.TYPE_FIELD_SELECT ||
                item.fieldType === types.TYPE_FIELD_AUTOCOMPLETE ||
                item.fieldType === types.TYPE_FIELD_SELECT_MULTIPLE) &&
              item.dataSource === "API"
            ) {
              void this.props.getOptions(item);
            }
          }
        }
      }
    }

    if (pathUrl[3] === "edit") {
      await this.props.fetchDataById(this.props.location.state.id);
    }

    this.setState({
      loading: false,
      generalConfig,
    });
  }

  render() {
    const { classes, t, model } = this.props;
    const href = window.location.pathname.split("/").map((x) => x.toLowerCase());
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title2}`;
    const title3 = href[3] === "add" ? "Tambah " + title2 : "Ubah " + title2;

    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    if (model.loading) {
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
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            className="flex flex-col m-16 justify-center"
          >
            {href[3] === "add" && this.state.generalConfig.prependContentAddForm != null ? (
              <div className="mb-16">
                <this.state.generalConfig.prependContentAddForm />
              </div>
            ) : null}

            {href[3] === "edit" && this.state.generalConfig.prependContentEditForm != null ? (
              <div className="mb-16">
                <this.state.generalConfig.prependContentEditForm />
              </div>
            ) : null}
            <Grid container spacing={2}>
              {this.props.formMaker.fieldList
                .filter((x) => x.showInForm == null || x.showInForm)
                .map((item, index) => {
                  return fieldCreator.createField(index, item, this.props.setValue, true);
                })}
            </Grid>
            <div className="mt-16">
              <Button variant="contained" color="default" onClick={() => history.goBack()}>
                Batal
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!this.state.isFormValid}
                style={{ marginLeft: "16px" }}
                onClick={async () => await this.props.saveData()}
              >
                Simpan
              </Button>
            </div>
            {href[3] === "add" && this.state.generalConfig.appendContentAddForm != null ? (
              <div className="m-16">
                <this.state.generalConfig.appendContentAddForm />
              </div>
            ) : null}

            {href[3] === "edit" && this.state.generalConfig.appendContentEditForm != null ? (
              <div className="m-16">
                <this.state.generalConfig.appendContentEditForm />
              </div>
            ) : null}
          </Formsy>
        }
      />
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    navigation: state.fuse.navigation,
    access: state.globalReducer.pageRule,
    formMaker: state.formMaker,
    model: state.model,
    role: state.auth.user.role[0],
  };
};

const mapDispatchToProps = {
  setValue,
  initModel: Model.initModel,
  fetchDataById: Model.fetchDataById,
  saveData: Model.saveData,
  clearFilter: Model.clearFilter,
  addField,
  getOptions,
  clearField,
  resetField,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(Form)));

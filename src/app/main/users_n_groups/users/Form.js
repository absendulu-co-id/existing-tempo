import * as types from "@mid/components/field/types";
import * as fieldCreator from "@mid/helper/fieldCreator.helper";
import * as Model from "@mid/store/model/action.model";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { data } from "@mid/components/config/general.config";
import { addField, clearField, getOptions, resetField, setValue } from "@mid/store/formMaker/action.formMaker";
import HeaderComponent from "app/components/HeaderComponent";
import history from "app/services/history";
import Formsy from "formsy-react";
import { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router";

const styles = (theme) => ({
  layoutRoot: {},
});

class Form extends Component {
  state = {
    success: false,
    redirect: false,
    loading: false,
    data: {},
    userGroupData: [],
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

  componentDidMount() {
    this.setState({
      loading: true,
    });
    const pathUrl = window.location.pathname.split("/");
    const generalConfig = data[`/${pathUrl[1]}/${pathUrl[2]}`];

    this.props.initModel({
      model: generalConfig.model,
      endPoint: generalConfig.endPoint,
      defaultOrder: generalConfig.defaultOrder,
      primaryKey: generalConfig.primaryKey,
    });
    this.props.clearField();
    this.props.resetField();
    this.props.clearFilter();
    generalConfig.fields.forEach((item, index) => {
      if (item.allowInsert == undefined || item.allowInsert == true) {
        this.props.addField(item);
        if (
          (item.fieldType === types.TYPE_FIELD_SELECT || item.fieldType === types.TYPE_FIELD_AUTOCOMPLETE) &&
          item.dataSource === "API"
        ) {
          this.props.getOptions(item);
        }
      }
    });

    if (pathUrl[3] === "edit") {
      this.props.fetchDataById(this.props.location.state.id);
    }

    this.setState({ loading: false }); // revisi sepertinya endpoin bisa di hapus
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
    }
    if (model.loading) {
      // perlu di revisi
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
            className="flex flex-col justify-center w-full"
          >
            <div className="p-24">
              <Grid container spacing={2}>
                {this.props.formMaker.fieldList.map((item, index) => {
                  return fieldCreator.createField(index, item, this.props.setValue, true);
                })}
              </Grid>
            </div>
            <div className="p-24">
              <Button variant="contained" style={{ marginTop: "2%" }} color="default" onClick={() => history.goBack()}>
                Batal
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!this.state.isFormValid}
                style={{ marginTop: "2%", marginLeft: "1%" }}
                onClick={() => this.props.saveData()}
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

const mapStateToProps = (state) => {
  return {
    navigation: state.fuse.navigation,
    access: state.globalReducer.pageRule,
    formMaker: state.formMaker,
    model: state.model,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setValue: (event, newValue, fieldName) => {
      dispatch(setValue(event, newValue, fieldName));
    },
    initModel: (modelConfig) => {
      dispatch(Model.initModel(modelConfig));
    },
    fetchDataById: (id) => {
      dispatch(Model.fetchDataById(id));
    },
    saveData: () => {
      dispatch(Model.saveData());
    },
    clearFilter: () => {
      dispatch(Model.clearFilter());
    },
    addField: (field) => {
      dispatch(addField(field));
    },
    getOptions: (field) => {
      dispatch(getOptions(field));
    },
    clearField: () => {
      dispatch(clearField());
    },
    resetField: () => {
      dispatch(resetField());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(withTranslation()(Form)));

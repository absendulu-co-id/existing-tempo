import HeaderComponent from "../../../components/HeaderComponent";
import { PayrollComponentTable } from "./components/PayrollComponentTable";
import * as Sentry from "@sentry/react";
import { WithStore, withStore } from "@/app/hoc/withStore";
import { useStore } from "@/app/store/store";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Icon } from "@iconify-icon/react";
import { Button, Grid, Theme, WithStyles, withStyles } from "@material-ui/core";
import { Styles } from "@material-ui/styles";
import { AccordionSearch } from "app/components/AccordionSearch";
import { RootState } from "app/store";
import Axios from "axios";
import { PayrollComponent as PayrollComponentModel, PayrollComponentType } from "interface";
import { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

const styles: Styles<Theme, Props> = (theme: Theme) => ({
  layoutRoot: {},
});

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true>, WithStore {}

interface States {
  redirect: boolean;
  loading: boolean;
  payrollComponents: PayrollComponentModel[];
}

class PayrollComponent extends Component<Props, States> {
  state: States = {
    redirect: false,
    loading: false,
    payrollComponents: [],
  };

  onDelete = async (selectedData: PayrollComponentModel[]) => {
    this.setState({ loading: true });

    const ids = selectedData.map((x) => x.payrollComponentId);

    try {
      await Promise.all(ids.map(async (x) => await Axios.delete(`v1/payroll-component/${x}`)));

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Success",
      });
    } catch (error: any) {
      Sentry.captureException(error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      // await this.getData();
    }
  };

  componentDidMount() {
    void this.props.store.PayrollSlice.actions.fetchComponents();
  }

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

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
        header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
        contentToolbar={
          <div className="px-24">
            <h2>{title2}</h2>
          </div>
        }
        content={
          <div className="m-16">
            <AccordionSearch
              onClearSearch={() => {
                throw new Error("TESTING not implemented.");
              }}
              onSearch={() => {
                console.log(useStore.getState());
              }}
            >
              <Grid container spacing={2}></Grid>
            </AccordionSearch>

            <Button
              component={Link}
              to="/payroll/component/add"
              variant="contained"
              color="primary"
              startIcon={<Icon icon="mdi:plus" />}
              className="mr-8"
            >
              Tambah
            </Button>

            <div className="mt-16" />

            <PayrollComponentTable
              payrollComponents={this.props.store.PayrollSlice.components}
              componentType={PayrollComponentType.EARNING}
              onDelete={this.onDelete}
              tableProps={{ isLoading: this.props.store.PayrollSlice.loading }}
            />
            <div className="mt-8" />
            <PayrollComponentTable
              payrollComponents={this.props.store.PayrollSlice.components}
              componentType={PayrollComponentType.DEDUCTION}
              onDelete={this.onDelete}
              tableProps={{ isLoading: this.props.store.PayrollSlice.loading }}
            />
            <div className="mt-8" />
            <PayrollComponentTable
              payrollComponents={this.props.store.PayrollSlice.components}
              componentType={PayrollComponentType.BENEFIT}
              onDelete={this.onDelete}
              tableProps={{ isLoading: this.props.store.PayrollSlice.loading }}
            />
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStore(connector(withStyles(styles, { withTheme: true })(withTranslation()(PayrollComponent))));

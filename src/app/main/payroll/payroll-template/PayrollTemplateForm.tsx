import HeaderComponent from "../../../components/HeaderComponent";
import { PayrollTemplateFormComponent } from "../components/PayrollTemplateFormComponent";
import { WithStore, withStore } from "@/app/hoc/withStore";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Button, Theme, WithStyles, withStyles } from "@material-ui/core";
import { Styles } from "@material-ui/styles";
import { MyColumn } from "app/components/MyMaterialTable";
import history from "app/services/history";
import { RootState } from "app/store";
import Axios from "axios";
import { PayrollAmountType, PayrollTemplate } from "interface";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import sweetalert2 from "sweetalert2/dist/sweetalert2.js";

interface Props
  extends WithTranslation,
    RouteComponentProps<{ id: string }>,
    WithStyles<typeof styles, true>,
    WithStore {}

interface States {
  redirect: boolean;
  loading: boolean;
  employeeId: string;
}

const styles: Styles<Theme, Props> = (theme: Theme) => ({
  layoutRoot: {},
});

class PayrollTemplateForm extends Component<Props, States> {
  state: States = {
    redirect: false,
    loading: false,
    employeeId: this.props.match.params.id,
  };

  columns: MyColumn<any>[] = [];

  submit = async (form: Partial<PayrollTemplate>, model: PayrollTemplate) => {
    this.setState({ loading: true });
    const data = form.payrollComponentEmployees
      ?.map((x1) => {
        const x = { ...x1 };
        delete x._index;
        delete (x as any).employeeId;
        delete (x as any).createdAt;
        delete (x as any).updatedAt;
        if (x.payrollComponentEmployeeId != null && x.payrollComponentEmployeeId < 1)
          delete x.payrollComponentEmployeeId;

        if (x.amountType != PayrollAmountType.EXACT) {
          x.amount = x.amount?.toString().toDecimal();
        }

        if (x.payrollComponentId == null) {
          return x;
        } else {
          const component = this.props.store.PayrollSlice.components.find(
            (y) => y.payrollComponentId == x.payrollComponentId,
          );
          if (component == null) {
            console.warn("Payroll component not found:", JSON.stringify(component));
            return null;
          }

          if (x.name == component.name) delete x.name;
          if (x.amount == component.amount) delete x.amount;
          if (x.amountType == component.amountType) delete x.amountType;
          if (x.amountCalculation == component.amountCalculation) delete x.amountCalculation;
          if (x.isFixedAllowance == component.isFixedAllowance) delete x.isFixedAllowance;
          if (x.isTaxable == component.isTaxable) delete x.isTaxable;
          if (x.notes == component.notes) delete x.notes;
          if (x.type == component.type) delete x.type;

          if (
            x.name == null &&
            x.amount == null &&
            x.notes == null &&
            x.amountCalculation == null &&
            x.amountType == null &&
            x.type == null &&
            x.isFixedAllowance == null &&
            x.isTaxable == null &&
            !x.isEnabled
          ) {
            return null;
          }

          return x;
        }
      })
      .filter((x) => x != null);

    if (model.payrollBaseSalary?.prorate?.toString() == "_") {
      delete model.payrollBaseSalary.prorate;
    }

    try {
      await Promise.all([
        Axios.post(`v1/payroll-component-employee/bulk/${this.state.employeeId}`, data),
        Axios.post(`v1/payroll-base-salary/upsert/${this.state.employeeId}`, model.payrollBaseSalary),
      ]);

      await sweetalert2.fire({
        title: "Success",
        text: "Success",
        icon: "success",
      });
      this.setState({
        redirect: true,
      });
    } catch (error: any) {
      await sweetalert2.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    void this.props.store.PayrollSlice.actions.fetchComponents();
    void this.props.store.PayrollSlice.actions.fetchTemplates(this.state.employeeId);
  }

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

    if (redirect) {
      return <Redirect to="/payroll/template" />;
    } else if (loading || this.props.store.PayrollSlice.loading) {
      return <FuseLoading />;
    }

    const template = this.props.store.PayrollSlice.templates.find((x) => x.employeeId == this.state.employeeId);

    return (
      <FusePageCarded
        classes={{
          root: classes.layoutRoot,
        }}
        header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
        contentToolbar={
          <div className="px-24">
            <h2>{t("payroll_template")}</h2>
          </div>
        }
        content={
          <div className="m-8">
            {template != null && (
              <PayrollTemplateFormComponent
                onSubmit={this.submit}
                payrollTemplate={template}
                renderAction={(isFormValid) => (
                  <React.Fragment>
                    <Button variant="contained" color="default" onClick={() => history.goBack()}>
                      Batal
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isFormValid}
                      style={{ marginLeft: "16px" }}
                      type="submit"
                    >
                      Simpan
                    </Button>
                  </React.Fragment>
                )}
              />
            )}
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

export default withStore(
  connector(withRouter(withStyles(styles, { withTheme: true })(withTranslation()(PayrollTemplateForm)))),
);

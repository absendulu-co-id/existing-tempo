import HeaderComponent from "../../../components/HeaderComponent";
import { PayrollBaseSalaryMiniTable } from "../components/PayrollBaseSalaryMiniTable";
import { PayrollEmployeeMiniTable } from "../components/PayrollEmployeeMiniTable";
import { PayrollTemplateComponentMiniTable } from "./components/PayrollTemplateComponentMiniTable";
import { WithStore, withStore } from "@/app/hoc/withStore";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Icon } from "@iconify-icon/react";
import { Theme, WithStyles, withStyles } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Styles } from "@material-ui/styles";
import { MyColumn, MyMaterialTable } from "app/components/MyMaterialTable";
import { RootState } from "app/store";
import { PayrollComponentType, PayrollTemplate } from "interface";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router";

interface Props extends WithTranslation, WithStyles<typeof styles, true>, WithStore {}

interface States {
  redirect: boolean;
  loading: boolean;
  columns: MyColumn<PayrollTemplate>[];
  check: boolean;
}

const styles: Styles<Theme, Props> = (theme: Theme) => ({
  layoutRoot: {},
});

class PayrollComponentPayEmployee extends Component<Props, States> {
  state: States = {
    redirect: false,
    loading: false,
    columns: [
      {
        title: this.props.t("employee"),
        width: 150,
        render: (rowData) => <PayrollEmployeeMiniTable rowData={rowData} compact />,
      },
      {
        title: this.props.t("salary"),
        width: 200,
        render: (rowData) => <PayrollBaseSalaryMiniTable rowData={rowData} />,
      },
      {
        title: this.props.t("component"),
        render: (rowData) => (
          <React.Fragment>
            <PayrollTemplateComponentMiniTable
              componentType={PayrollComponentType.EARNING}
              payrollComponentEmployees={rowData.payrollComponentEmployees}
              payrollComponents={this.props.store.PayrollSlice.components}
            />
            <PayrollTemplateComponentMiniTable
              componentType={PayrollComponentType.BENEFIT}
              payrollComponentEmployees={rowData.payrollComponentEmployees}
              payrollComponents={this.props.store.PayrollSlice.components}
            />
            <PayrollTemplateComponentMiniTable
              componentType={PayrollComponentType.DEDUCTION}
              payrollComponentEmployees={rowData.payrollComponentEmployees}
              payrollComponents={this.props.store.PayrollSlice.components}
            />
          </React.Fragment>
        ),
      },
    ],
    check: false,
  };

  componentDidMount() {
    void this.props.store.PayrollSlice.actions.fetchComponents();
    void this.props.store.PayrollSlice.actions.fetchTemplates();
  }

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
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
            <h2>Payroll Template</h2>
          </div>
        }
        content={
          <div className="m-8">
            <MyMaterialTable<PayrollTemplate>
              data={this.props.store.PayrollSlice.templates}
              columns={this.state.columns}
              isLoading={this.props.store.PayrollSlice.loading}
              actions={[
                {
                  icon: () => <Icon icon="mdi:edit" />,
                  tooltip: "Ubah",
                  actionRouter: true,
                  to: (location, data) => `/payroll/template/edit/${data.employeeId}`,
                },
              ]}
              options={{
                rowStyle: (data) => {
                  let style: React.CSSProperties = { verticalAlign: "top" };
                  if (data.payrollBaseSalary?.salary == 0 || data.payrollBaseSalary?.salary == null) {
                    style = {
                      ...style,
                      backgroundColor: red[400],
                    };
                  }

                  return style;
                },
              }}
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

export default withStore(
  connector(withStyles(styles, { withTheme: true })(withTranslation()(PayrollComponentPayEmployee))),
);

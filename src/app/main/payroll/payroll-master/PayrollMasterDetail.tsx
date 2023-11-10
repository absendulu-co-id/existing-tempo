import HeaderComponent from "../../../components/HeaderComponent";
import { PayrollDialogConfirmationSend } from "../components/PayrollDialogConfirmationSend";
import { PayrollEmployeeMiniTable } from "../components/PayrollEmployeeMiniTable";
import { PayrollRecapitulationMiniTable } from "../components/PayrollRecapitulationMiniTable";
import { PayrollTemplateFormComponent } from "../components/PayrollTemplateFormComponent";
import { PayrollTemplateComponentMiniTable } from "../payroll-template/components/PayrollTemplateComponentMiniTable";
import { WithStore, withStore } from "@/app/hoc/withStore";
import { PayrollService } from "@/app/services/payroll";
import { useStore } from "@/app/store/store";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Icon } from "@iconify-icon/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Tooltip,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Styles } from "@material-ui/styles";
import { MyFormattedNumber } from "app/components/MyFormattedNumber";
import { MyMaterialTable } from "app/components/MyMaterialTable";
import history from "app/services/history";
import { RootState } from "app/store";
import Axios from "axios";
import { PayrollComponentType, PayrollTemplate, Payslip } from "interface";
import moment from "moment";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

const styles: Styles<Theme, Props> = (theme: Theme) => ({
  layoutRoot: {},
});

interface Props
  extends WithTranslation,
    WithStyles<typeof styles, true>,
    RouteComponentProps<{ id?: string }>,
    WithStore {}

interface States {
  redirect: boolean;
  loading: boolean;
  dialogSendOpen: boolean;
  dialogEditOpen: boolean;
  editPayslipId: number | null;
}

class PayrollMasterDetail extends Component<Props, States> {
  state: States = {
    redirect: false,
    loading: false,
    dialogSendOpen: false,
    dialogEditOpen: false,
    editPayslipId: null,
  };

  async getData() {
    if (this.props.match.params.id == null) {
      throw new Error("Id is null");
    }

    await useStore.getState().PayrollSlice.actions.fetchPayslips(parseInt(this.props.match.params.id));
  }

  onDelete = async () => {
    const resSwal = await Swal.fire({
      icon: "warning",
      title: this.props.t("confirmation").toString(),
      text: "Apakah Anda yakin ingin menghapus payroll ini?",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
    });

    if (resSwal.isConfirmed) {
      this.setState({ loading: true });
      try {
        await Axios.delete(`v1/payroll/${this.props.match.params.id!}`);
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payroll deleted successfully",
        });
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      } finally {
        history.goBack();
      }
    }
  };

  async componentDidMount() {
    await this.getData();
  }

  getPayrollTemplate = () => {
    const payslip = this.props.store.PayrollSlice.payrolls
      .find((x) => x.payrollId == parseInt(this.props.match.params.id!))
      ?.payslips.find((x) => x.payslipId == this.state.editPayslipId);
    if (payslip == null) throw new Error("Selected Payslip not found");

    return PayrollService.payslipToTemplate({ payslip });
  };

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

    if (redirect || this.props.match.params.id == null) {
      return <Redirect to="/login" />;
    } else if (loading) {
      return <FuseLoading />;
    }

    const payroll = this.props.store.PayrollSlice.payrolls.find(
      (x) => x.payrollId == parseInt(this.props.match.params.id!),
    );

    return (
      <React.Fragment>
        <FusePageCarded
          classes={{
            root: classes.layoutRoot,
          }}
          header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
          contentToolbar={
            <div className="px-24">
              <h2>Payroll Master</h2>
            </div>
          }
          content={
            <div className="m-8">
              {payroll != null && (
                <React.Fragment>
                  <div className="text-center mb-8">
                    <Typography variant="h6" component="p">
                      {payroll.companyName}
                    </Typography>
                    <Typography variant="body1" component="p">
                      {payroll.companyAddress}
                    </Typography>
                    <Typography variant="body1" component="p">
                      {payroll.companyPhone}
                    </Typography>
                  </div>

                  <div className="text-center">
                    <Typography variant="subtitle2" component="p">
                      {t("period")}: {payroll.period}
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                      {moment(payroll.cutoffStart).format("ll")} - {moment(payroll.cutoffEnd).format("ll")}
                    </Typography>
                  </div>

                  <div className="mx-4 my-16 text-center">
                    <Typography variant="h3" component="p" className="font-bold">
                      {!payroll.isFinal && <span style={{ color: red[800] }}>DRAFT</span>}
                    </Typography>
                  </div>

                  {payroll.creatorName != null && (
                    <div className="text-right">
                      <Typography variant="subtitle2" component="p">
                        {t("creator")}: {payroll.creatorName}, {payroll.creatorPosition}
                      </Typography>
                    </div>
                  )}

                  {!payroll.isFinal && (
                    <div className="m-8 mb-16">
                      <Button
                        variant="contained"
                        className="mr-8"
                        startIcon={<Icon icon="mdi:delete" />}
                        onClick={this.onDelete}
                      >
                        {t("delete")}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Icon icon="mdi:email" />}
                        onClick={() => this.setState({ dialogSendOpen: true })}
                      >
                        {t("save_as_final_and_send")}
                      </Button>
                    </div>
                  )}
                </React.Fragment>
              )}
              <MyMaterialTable<Payslip>
                data={payroll?.payslips!}
                columns={[
                  {
                    title: t("employee"),
                    field: "employeeName",
                    render: (rowData) => {
                      return <PayrollEmployeeMiniTable rowData={rowData as any} compact />;
                    },
                  },
                  {
                    title: t("recapitulation"),
                    render: (rowData) => {
                      return (
                        <PayrollRecapitulationMiniTable
                          recapitulation={{
                            workingDay: rowData.workingDays,
                            attendanceWorkingDay: rowData.presentDays,
                            leave: rowData.leaveDays,
                            absent: rowData.absentDays,
                          }}
                        />
                      );
                    },
                  },
                  {
                    title: t("component"),
                    render: (rowData) => (
                      <React.Fragment>
                        <PayrollTemplateComponentMiniTable
                          componentType={PayrollComponentType.EARNING}
                          payslipDetails={rowData.payslipDetails}
                        />
                        <PayrollTemplateComponentMiniTable
                          componentType={PayrollComponentType.DEDUCTION}
                          payslipDetails={rowData.payslipDetails}
                        />
                        <PayrollTemplateComponentMiniTable
                          componentType={PayrollComponentType.BENEFIT}
                          payslipDetails={rowData.payslipDetails}
                        />
                        <p className="text-center m-8">
                          <Typography component="span" variant="subtitle1" className="mr-8">
                            {t("take_home_pay")}
                          </Typography>
                          <Typography component="span" variant="h6">
                            <MyFormattedNumber value={rowData.takeHomePay ?? 0} />
                          </Typography>
                        </p>
                      </React.Fragment>
                    ),
                  },
                  {
                    title: t("bank_account_number"),
                    field: "bankAccountNumber",
                    hidden: true,
                  },
                  {
                    title: t("bank_account_name"),
                    field: "bankAccountName",
                    hidden: true,
                  },
                  {
                    title: t("bank_name"),
                    field: "bankName",
                    hidden: true,
                  },
                  {
                    title: t("bpjs_number"),
                    field: "bpjsNumber",
                    hidden: true,
                  },
                  {
                    title: t("tax_identification_number"),
                    field: "taxIdentificationNumber",
                    hidden: true,
                  },
                  {
                    title: t("ptkp"),
                    field: "ptkp",
                    hidden: true,
                  },
                  {
                    title: t("created_at"),
                    render: (rowData) => (
                      <Tooltip title={moment(rowData.createdAt).format("ll LTS")}>
                        <span>{moment(rowData.createdAt).fromNow()}</span>
                      </Tooltip>
                    ),
                    hidden: true,
                  },
                  {
                    title: t("updated_at"),
                    render: (rowData) => (
                      <Tooltip title={moment(rowData.updatedAt).format("ll LTS")}>
                        <span>{moment(rowData.updatedAt).fromNow()}</span>
                      </Tooltip>
                    ),
                    hidden: true,
                  },
                ]}
                actions={[
                  {
                    icon: () => <Icon icon="mdi:edit" />,
                    tooltip: t("edit").toString(),
                    disabled: payroll?.isFinal,
                    onClick: (e, data) => {
                      this.setState({
                        dialogEditOpen: true,
                        editPayslipId: (data as Payslip).payslipId,
                      });
                    },
                  },
                  {
                    icon: () => <Icon icon="mdi:file" />,
                    actionRouter: true,
                    tooltip: t("download_payslip").toString(),
                    to: (location, data) => {
                      const url = window.localStorage.getItem("serverUrl");
                      return {
                        pathname: url + `/payslip/download/${data.employeeId}/${data.nanoidUrl}`,
                      };
                    },
                    target: "_blank",
                    disabled: !payroll?.isFinal,
                  },
                ]}
                options={{
                  columnsButton: true,
                }}
              />
            </div>
          }
        />

        <PayrollDialogConfirmationSend
          dialogOpenState={[
            this.state.dialogSendOpen,
            (dialogSendOpen) => this.setState((prevState) => ({ dialogSendOpen })),
          ]}
          loadingState={[this.state.loading, (loading) => this.setState((prevState) => ({ loading }))]}
          payrollId={payroll?.payrollId}
          onSuccess={async () => await this.getData()}
        />

        <Dialog
          open={this.state.dialogEditOpen}
          onClose={() => this.setState({ dialogEditOpen: false })}
          scroll="paper"
          fullScreen
        >
          <DialogTitle>{t("edit_salary_component")}</DialogTitle>
          <DialogContent>
            {this.state.editPayslipId != null && (
              <PayrollTemplateFormComponent
                onSubmit={(form) => {
                  console.log(form);
                }}
                payrollTemplate={this.getPayrollTemplate() as PayrollTemplate}
                isEditPayslip
                renderAction={(isFormValid) => (
                  <DialogActions>
                    <Button onClick={() => this.setState({ dialogEditOpen: false })} color="default">
                      {t("cancel")}
                    </Button>
                    <Button color="primary" autoFocus type="submit" disabled={!isFormValid}>
                      {t("save")}
                    </Button>
                  </DialogActions>
                )}
              />
            )}
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(
  withRouter(withStyles(styles, { withTheme: true })(withTranslation()(withStore(PayrollMasterDetail)))),
);

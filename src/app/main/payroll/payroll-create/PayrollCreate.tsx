import HeaderComponent from "../../../components/HeaderComponent";
import { PayrollDialogConfirmationSend } from "../components/PayrollDialogConfirmationSend";
import { PayrollCreate1 } from "./PayrollCreate1";
import { PayrollCreate2 } from "./PayrollCreate2";
import { PayrollCreate3 } from "./PayrollCreate3";
import { PayrollCreate4 } from "./PayrollCreate4";
import { WithStore, withStore } from "@/app/hoc/withStore";
import { Store } from "@/app/store/store";
import { FusePageCarded } from "@fuse";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { Styles } from "@material-ui/styles";
import { RootState } from "app/store";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import Swal from "sweetalert2/dist/sweetalert2.js";

const styles: Styles<Theme, PayrollCreateProps> = (theme: Theme) => ({
  layoutRoot: {},
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export interface PayrollCreateProps
  extends PropsFromRedux,
    WithTranslation,
    WithStyles<typeof styles, true>,
    WithStore {}

export interface PayrollCreateStates {
  redirect: boolean;
  loading: boolean;
  step3Valid: boolean;
  dialogConfirmationSend: boolean;
  isStep4Done: boolean;
}

class PayrollCreate extends Component<PayrollCreateProps, PayrollCreateStates> {
  state: PayrollCreateStates = {
    redirect: false,
    loading: false,
    step3Valid: false,
    dialogConfirmationSend: false,
    isStep4Done: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await Promise.all([
      this.props.store.EmployeeSlice.actions.fetchEmployees(),
      this.props.store.PayrollSlice.actions.fetchComponents(),
    ]);
    this.setState({ loading: false });

    window.addEventListener("beforeunload", this.onBeforeUnload);
  }

  componentWillUnmount(): void {
    window.removeEventListener("beforeunload", this.onBeforeUnload);

    const activeStep = this.props.store.PayrollCreateSlice.activeStep;
    if (activeStep == 1 || activeStep == 4) {
      this.props.store.PayrollCreateSlice.actions.resetState();
    }
  }

  step2Validation = async (): Promise<boolean> => {
    if (this.props.store.PayrollCreateSlice.activeStep != 2) return true;
    if (this.props.store.PayrollCreateSlice.templates == null) throw new Error("Payroll Template is empty");

    for (const x of this.props.store.PayrollCreateSlice.templates) {
      if (x.payrollBaseSalary?.salary == null || x.payrollBaseSalary.salary == 0) {
        await Swal.fire({
          title: "Karyawan Tidak Mempunyai Gaji",
          icon: "error",
          text: "Untuk melanjutkan payroll, Anda perlu mengisi semua gaji karyawan",
        });
        return false;
      }
    }

    return true;
  };

  step3Validation = async (): Promise<boolean> => {
    if (this.props.store.PayrollCreateSlice.activeStep != 3) return true;
    if (this.props.store.PayrollCreateSlice.templates.length == 0) throw new Error("Payroll Template is empty");

    if (await this.props.store.PayrollCreateSlice.actions.createPayroll()) {
      return true;
    }

    return false;
  };

  onBeforeUnload = (e: BeforeUnloadEvent) => {
    const activeStep = this.props.store.PayrollCreateSlice.activeStep;

    if (activeStep == 2 || activeStep == 3 || this.state.dialogConfirmationSend) {
      e.preventDefault();
      e.returnValue = "";
      return;
    }

    delete e.returnValue;
  };

  render() {
    const { classes, t } = this.props;
    const { redirect } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

    const store = this.props.store;
    const activeStep = store.PayrollCreateSlice.activeStep;

    if (redirect) {
      return <Redirect to="/login" />;
    }

    return (
      <React.Fragment>
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
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={6}>
                  <Stepper activeStep={store.PayrollCreateSlice.activeStep - 1}>
                    <Step>
                      <StepLabel>{t("period")}</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>{t("employee")}</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>{t("company")}</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>{t("done")}</StepLabel>
                    </Step>
                  </Stepper>
                </Grid>
                <Grid item xs={12}>
                  {activeStep === 1 && <PayrollCreate1 />}
                  {activeStep === 2 && <PayrollCreate2 />}
                  {activeStep === 3 && (
                    <PayrollCreate3 setState={(state, callback) => this.setState(state, callback)} />
                  )}
                  {activeStep === 4 && (
                    <PayrollCreate4
                      isStep4Done={this.state.isStep4Done}
                      setState={(state, callback) => this.setState(state, callback)}
                    />
                  )}
                </Grid>
                {activeStep !== 4 && (
                  <Grid item xs={3} className="my-32">
                    <Button
                      color="default"
                      onClick={async () => {
                        if (activeStep === 2) {
                          const swalResult = await Swal.fire({
                            icon: "warning",
                            title: "Apakah Anda mau kembali?",
                            text: "Payroll yang sudah diubah akan hilang!",
                            reverseButtons: true,
                            showCancelButton: true,
                            showConfirmButton: true,
                          });
                          if (swalResult.isConfirmed) {
                            store.setStore((store: Store) => {
                              store.PayrollCreateSlice.activeStep--;
                            });
                          }
                        } else {
                          store.setStore((store: Store) => {
                            store.PayrollCreateSlice.activeStep--;
                          });
                        }
                      }}
                      disabled={activeStep === 1 || activeStep === 4}
                    >
                      {t("back")}
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={async () => {
                        // if (activeStep === 1) {
                        //   void this.getStep2();
                        // }
                        if ((await this.step2Validation()) && (await this.step3Validation())) {
                          store.setStore((store: Store) => {
                            store.PayrollCreateSlice.activeStep++;
                          });
                        }
                      }}
                      className="ml-16"
                      disabled={
                        store.PayrollCreateSlice.selectedEmployees.length == 0 ||
                        (activeStep == 3 && !this.state.step3Valid)
                      }
                    >
                      {t("next")}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </div>
          }
        />
        <Backdrop
          className={classes.backdrop}
          open={
            this.state.loading ||
            store.HolidaySlice.loading ||
            store.EmployeeSlice.loading ||
            store.PayrollCreateSlice.loading ||
            store.PayrollSlice.loading
          }
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {activeStep == 4 && (
          <PayrollDialogConfirmationSend
            dialogOpenState={[
              this.state.dialogConfirmationSend,
              (dialogOpen) =>
                this.setState((prevState) => ({
                  dialogConfirmationSend: dialogOpen,
                })),
            ]}
            loadingState={[this.state.loading, (loading) => this.setState((prevState) => ({ loading }))]}
            payrollId={store.PayrollCreateSlice.payroll.payrollId!}
            onSuccess={() => this.setState({ isStep4Done: true })}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(withStore(PayrollCreate))));

import HeaderComponent from "../../../components/HeaderComponent";
import * as Sentry from "@sentry/react";
import { WithStore, withStore } from "@/app/hoc/withStore";
import { useStore } from "@/app/store/store";
import { FuseLoading, FusePageCarded, SelectFormsy, TextFieldFormsy } from "@fuse";
import { formsyErrorMessage } from "@fuse/components/formsy/FormsyErrorMessage";
import { Button, Grid, MenuItem, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Styles } from "@material-ui/styles";
import TextFieldCurrencyFormsy from "app/components/TextField/TextFieldCurrencyFormsy";
import TextFieldPercentageFormsy from "app/components/TextField/TextFieldPercentageFormsy";
import history from "app/services/history";
import { RootState } from "app/store";
import axios, { AxiosResponse } from "axios";
import Formsy from "formsy-react";
import { PayrollAmountCalculation, PayrollAmountType, PayrollComponent, PayrollComponentType } from "interface";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import { RouteComponentProps, withRouter } from "react-router-dom";
import sweetalert2 from "sweetalert2/dist/sweetalert2.js";

const styles: Styles<Theme, Props> = (theme: Theme) => ({
  layoutRoot: {},
});

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props
  extends PropsFromRedux,
    RouteComponentProps<{ id: string }>,
    WithTranslation,
    WithStyles<typeof styles, true>,
    WithStore {}

interface States {
  redirect: boolean;
  loading: boolean;
  disable: boolean;
  isFormValid: boolean;
  data: Partial<PayrollComponent>;
}

class PayrollComponentUpdate extends Component<Props, States> {
  state: States = {
    redirect: false,
    loading: false,
    disable: false,
    isFormValid: false,
    data: {
      name: "",
      amount: "" as any,
      notes: "",
      type: "" as any,
      amountType: PayrollAmountType.EXACT,
      amountCalculation: "" as any,
    },
  };

  payrollComponentsUnsubscribe: ReturnType<typeof useStore.subscribe> | null = null;

  changeHandler = (event: React.ChangeEvent<any>, newValue?: any, fieldName?: string) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      data: {
        ...(prevState.data as any),
        [name]: value,
      },
    }));
  };

  submit = async (model: Partial<PayrollComponent>) => {
    model = {
      ...model,
      amount:
        model.amount != null ? parseFloat(model.amount.toString().replaceAll(",", ".").replaceAll("%", "")) : undefined,
    };
    this.setState({ loading: true });

    try {
      let res: AxiosResponse;
      if (this.props.match.params.id != null) {
        const id = this.props.match.params.id;
        res = await axios.put(`/v1/payroll-component/${id}`, model);
      } else {
        res = await axios.post("/v1/payroll-component", model);
      }

      if (res.status == 200) {
        await sweetalert2.fire("Berhasil", "Data berhasil disimpan", "success");
        this.setState({ redirect: true });
      }
    } catch (error: any) {
      Sentry.captureException(error);
      await sweetalert2.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  componentDidMount() {
    if (this.props.match.params.id != null) {
      const id = parseInt(this.props.match.params.id);

      this.payrollComponentsUnsubscribe = useStore.subscribe(
        (state) => state.PayrollSlice,
        (payrollSlice) => {
          const component = payrollSlice.components.find((x) => x.payrollComponentId == id);
          if (component != null) {
            const newComponent = { ...component };
            if (newComponent.amountType.toLowerCase().includes("percentage")) {
              (newComponent as any).amount = Number(newComponent.amount).toLocaleString("id-ID", {
                minimumFractionDigits: 2,
              });
            }
            this.setState({
              data: newComponent,
              disable: payrollSlice.loading,
            });
          }
        },
      );

      void this.props.store.PayrollSlice.actions.fetchComponents(id);
    }
  }

  componentWillUnmount() {
    if (this.payrollComponentsUnsubscribe != null) this.payrollComponentsUnsubscribe();
  }

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

    if (redirect) {
      return <Redirect to="/payroll/component" />;
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
            <Formsy
              onValid={() => {
                this.setState({
                  isFormValid: true,
                });
              }}
              onInvalid={() => {
                this.setState({
                  isFormValid: false,
                });
              }}
              onValidSubmit={this.submit}
              disabled={this.state.disable}
            >
              <Grid container className="mb-32" justifyContent="center">
                <Grid item xs={12} md={4}>
                  <SelectFormsy
                    label={t("component_type").toString()}
                    name="type"
                    variant="outlined"
                    required
                    fullWidth
                    validationError={formsyErrorMessage(t, t("component_type")).isExisty}
                    validationErrors={formsyErrorMessage(t, t("component_type"))}
                    value={this.state.data.type}
                  >
                    <MenuItem disabled>Pilih {t("component_type")}</MenuItem>
                    {Object.values(PayrollComponentType).map((x, i) => (
                      <MenuItem value={x} key={i}>
                        {t(x.toLowerCase())}
                        {x == PayrollComponentType.BENEFIT && <small>&nbsp;({t("benefit_tooltip")})</small>}
                      </MenuItem>
                    ))}
                  </SelectFormsy>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextFieldFormsy
                    required
                    label={t("name").toString()}
                    name="name"
                    variant="outlined"
                    fullWidth
                    validationError={formsyErrorMessage(t, t("name")).isExisty}
                    validationErrors={formsyErrorMessage(t, t("name"))}
                    value={this.state.data.name}
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextFieldFormsy
                    label={t("internal_notes").toString()}
                    name="notes"
                    multiline
                    maxRows={4}
                    value={this.state.data.notes}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} className="my-24">
                <Grid item xs={12}>
                  <Typography variant="subtitle2">{t("amount")}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  {this.state.data.amountType == PayrollAmountType.EXACT && (
                    <TextFieldCurrencyFormsy
                      required
                      label={t("amount").toString()}
                      name="amount"
                      variant="outlined"
                      fullWidth
                      validations="isInt"
                      validationError={formsyErrorMessage(t, t("amount")).isExisty}
                      validationErrors={formsyErrorMessage(t, t("amount"))}
                      value={this.state.data.amount}
                    />
                  )}
                  {this.state.data.amountType != PayrollAmountType.EXACT && (
                    <TextFieldPercentageFormsy
                      required
                      label={t("amount_percentage").toString()}
                      name="amount"
                      variant="outlined"
                      fullWidth
                      validations={{
                        matchRegexp: /^100(,0{0,2})? *%?$|^\d{1,2}(,\d{1,2})? *%?$/,
                      }}
                      validationError={formsyErrorMessage(t, t("amount")).isExisty}
                      validationErrors={formsyErrorMessage(t, t("amount"))}
                      value={this.state.data.amount}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <SelectFormsy
                    required
                    label={t("amount_type").toString()}
                    name="amountType"
                    variant="outlined"
                    fullWidth
                    validationError={formsyErrorMessage(t, t("amount_type")).isExisty}
                    validationErrors={formsyErrorMessage(t, t("amount_type"))}
                    value={this.state.data.amountType}
                    onChange={(e) =>
                      this.setState((prev) => ({
                        data: {
                          ...prev.data,
                          amountType: e.target.value as any,
                        },
                      }))
                    }
                  >
                    <MenuItem disabled>Pilih {t("amount_type")}</MenuItem>
                    {Object.values(PayrollAmountType).map((x, i) => (
                      <MenuItem key={i} value={x}>
                        {t(x.toLowerCase())}
                      </MenuItem>
                    ))}
                  </SelectFormsy>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <SelectFormsy
                    required
                    label={t("amount_calculation").toString()}
                    name="amountCalculation"
                    variant="outlined"
                    fullWidth
                    validationError={formsyErrorMessage(t, t("amount_calculation")).isExisty}
                    validationErrors={formsyErrorMessage(t, t("amount_calculation"))}
                    value={this.state.data.amountCalculation}
                  >
                    <MenuItem disabled>Pilih {t("amount_calculation")}</MenuItem>
                    {Object.values(PayrollAmountCalculation).map((x, i) => (
                      <MenuItem key={i + "13"} value={x}>
                        {t(x.toLowerCase())}
                      </MenuItem>
                    ))}
                  </SelectFormsy>
                </Grid>
              </Grid>
              <div className="my-24">
                <Button variant="contained" color="default" onClick={() => history.goBack()}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "16px" }}
                  disabled={!this.state.isFormValid}
                >
                  Save
                </Button>
              </div>
            </Formsy>
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
  connector(withRouter(withStyles(styles, { withTheme: true })(withTranslation()(PayrollComponentUpdate)))),
);

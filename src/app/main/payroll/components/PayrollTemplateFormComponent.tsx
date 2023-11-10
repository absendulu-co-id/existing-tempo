import { PayrollTemplateComponentForm } from "../payroll-template/components/PayrollTemplateComponentForm";
import { PayrollEmployeeMiniTable } from "./PayrollEmployeeMiniTable";
import { Store, useStore } from "@/app/store/store";
import { SelectFormsy, TextFieldFormsy } from "@fuse";
import { formsyErrorMessage } from "@fuse/components/formsy/FormsyErrorMessage";
import { Avatar, Grid, InputAdornment, MenuItem, Typography } from "@material-ui/core";
import TextFieldCurrencyFormsy from "app/components/TextField/TextFieldCurrencyFormsy";
import Formsy from "formsy-react";
import { IModel, IResetModel, IUpdateInputsWithError } from "formsy-react/dist/interfaces";
import {
  PayrollAmountCalculation,
  PayrollAmountType,
  PayrollBaseSalaryPeriod,
  PayrollComponentEmployee,
  PayrollComponentEmployeeCreation,
  PayrollComponentType,
  PayrollSalaryProrate,
  PayrollTemplate,
  ReportRecapitulation,
} from "interface";
import cloneDeep from "lodash/cloneDeep";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";

interface Props {
  onSubmit: (
    form: Partial<PayrollTemplate>,
    model: IModel,
    resetModel: IResetModel,
    updateInputsWithError: IUpdateInputsWithError,
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => void;
  payrollTemplate: PayrollTemplate;

  renderAction?: (isFormValid: boolean) => React.ReactNode;
  isEditPayslip?: boolean;
  isCreatePayroll?: boolean;
}

export const _PayrollTemplateFormComponent: React.FC<Props> = ({ payrollTemplate, ...props }) => {
  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [form, setForm] = useImmer<Partial<PayrollTemplate>>(payrollTemplate);
  const [recapitulation, setRecapitulation] = useImmer<ReportRecapitulation | undefined>(undefined);

  const payrollComponents = useStore((store: Store) => store.PayrollSlice.components);
  const recapitulations = useStore((store: Store) => store.PayrollCreateSlice.recapitulations);

  useEffect(() => {
    const mergedComponents = [
      ...(cloneDeep(payrollComponents).map((x1) => {
        const x: Partial<PayrollComponentEmployeeCreation> = x1;
        const componentEmployee = payrollTemplate.payrollComponentEmployees.find(
          (y) => y.payrollComponentId == x.payrollComponentId,
        );
        x.notes ??= "";
        x.isEnabled = false;
        if (componentEmployee == null) return x;

        if (componentEmployee.payrollComponentEmployeeId != null)
          x.payrollComponentEmployeeId = componentEmployee.payrollComponentEmployeeId;
        if (componentEmployee.amount != null) x.amount = componentEmployee.amount;
        if (componentEmployee.amountType != null) x.amountType = componentEmployee.amountType;
        if (componentEmployee.amountCalculation != null) x.amountCalculation = componentEmployee.amountCalculation;
        if (componentEmployee.name != null) x.name = componentEmployee.name;
        if (componentEmployee.notes != null) x.notes = componentEmployee.notes;
        x.isEnabled = componentEmployee.isEnabled;
        return x;
      }) as PayrollComponentEmployee[]),
      ...cloneDeep(payrollTemplate.payrollComponentEmployees)
        .filter((x) => x.payrollComponentId == null)
        .map((x) => {
          x.notes ??= "";
          return x;
        }),
    ].map((x, i) => {
      (x as any)._index = i;

      if (x.amountType != PayrollAmountType.EXACT) {
        (x as any).amount = `${(x.amount ?? 0) * 100}%`;
      }
      return x;
    });

    setForm((form) => {
      delete form.payrollComponentEmployees;

      form.payrollBaseSalary ??= {
        salary: "" as any,
        period: PayrollBaseSalaryPeriod.MONTHLY,
        prorateManualDayCount: 0,
        employeeId: "",
      };

      form.payrollComponentEmployees = mergedComponents;
    });
  }, [payrollTemplate, payrollComponents]);

  useEffect(() => {
    const findRecapitulation = recapitulations.find((x) => x.employeeId == payrollTemplate.employeeId);
    setRecapitulation(findRecapitulation);
  }, [payrollTemplate.employeeId, recapitulations]);

  const inputOnChange = (
    event: ChangeEvent<{ name?: string; value: any; checked?: boolean }>,
    payrollComponentIndex?: number,
  ) => {
    const { name, value, checked } = event.target;

    if (name == null) {
      console.warn("PayrollTemplateEdit: inputOnChange, name is empty");
      return;
    }

    if (name.startsWith("payrollBaseSalary.")) {
      setForm((form) => {
        form.payrollBaseSalary![name.split(".")[1]] = value;
      });
      return;
    }

    if (name.startsWith("payrollComponentEmployees")) {
      const value1 = ["isEnabled", "isFixedAllowance", "isTaxable"].includes(name.split(".")[1])
        ? checked ?? value
        : value;

      const splittedName = name.split(".")[1];

      const index = form.payrollComponentEmployees?.findIndex((x) => x._index == payrollComponentIndex);
      if (index == -1 || index == null) {
        console.warn("PayrollTemplateEdit: inputOnChange, payrollComponentIndex is empty");
        return;
      }

      setForm((form) => {
        form.payrollComponentEmployees![index][splittedName] = value1;
      });
      return;
    }

    setForm((form) => {
      form[name] = value;
    });
  };

  const recapitulationOnChange = (event: ChangeEvent<{ name?: string; value: any }>) => {
    const { name, value } = event.target;

    if (name == null) {
      console.warn("PayrollTemplateEdit: recapitulationOnChange, name is empty");
      return;
    }
    const splittedName = name.split(".")[1];

    setRecapitulation((x) => {
      x![splittedName] = value;
    });
  };

  const formAdd = (payrollComponentType: PayrollComponentType) => {
    setForm((form) => {
      form.payrollComponentEmployees ??= [];

      form.payrollComponentEmployees!.push({
        employeeId: form.employeeId!,
        isEnabled: true,
        payrollComponentEmployeeId: Math.random() / 1000,
        type: payrollComponentType,
        isFixedAllowance: false,
        isTaxable: false,
        name: "",
        amountType: PayrollAmountType.EXACT,
        amountCalculation: PayrollAmountCalculation.FIXED,
        _index: form.payrollComponentEmployees.length,
      });
    });
  };

  const formDelete = (payrollComponentType: PayrollComponentType, _index?: number) => {
    if (_index == null || form.payrollComponentEmployees == null) return;

    const index = form.payrollComponentEmployees!.findIndex((x) => x._index == _index);
    if (index == -1) return;

    setForm((form) => {
      form.payrollComponentEmployees!.splice(index, 1);
    });
  };

  return (
    <Formsy
      onValid={() => setIsFormValid(true)}
      onInvalid={() => setIsFormValid(false)}
      onValidSubmit={(...param) => {
        props.onSubmit(form, ...param);
      }}
    >
      <Typography variant="h6" component="h2" className="mb-4">
        {t("employee")}
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={3} className="text-center" style={{ minHeight: "120px" }}>
          <Avatar
            className="w-full h-full d-block m-auto"
            style={{ maxHeight: "120px", maxWidth: "120px" }}
            alt={payrollTemplate.employeeName}
            src={payrollTemplate.profilePicture}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <PayrollEmployeeMiniTable rowData={payrollTemplate} />
        </Grid>
      </Grid>

      <hr className="w-full my-16" />

      <React.Fragment>
        <Typography variant="h6" component="h2" className="mb-16">
          {t("salary")}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextFieldCurrencyFormsy
              variant="outlined"
              name="payrollBaseSalary.salary"
              value={form.payrollBaseSalary?.salary ?? ""}
              validations="isNumeric"
              validationError={formsyErrorMessage(t, t("salary")).isExisty}
              validationErrors={formsyErrorMessage(t, t("salary"))}
              required
              onChange={inputOnChange}
              fullWidth
              label={t("salary").toString()}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SelectFormsy
              value={form.payrollBaseSalary?.period ?? ""}
              label={t("period").toString()}
              name="payrollBaseSalary.period"
              validationError={formsyErrorMessage(t, t("period")).isExisty}
              required
              variant="outlined"
              onChange={(event) => inputOnChange(event)}
              fullWidth
            >
              <MenuItem value="" disabled>
                {t("select_", { _: t("period") })}
              </MenuItem>
              {Object.values(PayrollBaseSalaryPeriod).map((x, i) => (
                <MenuItem key={i} value={x} disabled={x != PayrollBaseSalaryPeriod.MONTHLY}>
                  {t(x.toLowerCase())} {x != PayrollBaseSalaryPeriod.MONTHLY && "(Belum Tersedia)"}
                </MenuItem>
              ))}
            </SelectFormsy>
          </Grid>
          <Grid
            item
            xs={12}
            sm={form.payrollBaseSalary?.prorate == PayrollSalaryProrate.MANUAL ? 6 : 12}
            md={form.payrollBaseSalary?.prorate == PayrollSalaryProrate.MANUAL ? 3 : 6}
          >
            <SelectFormsy
              value={form.payrollBaseSalary?.prorate ?? "_"}
              label={t("prorate").toString()}
              name="payrollBaseSalary.prorate"
              validationError={formsyErrorMessage(t, t("prorate")).isExisty}
              variant="outlined"
              onChange={(event) => inputOnChange(event)}
              fullWidth
            >
              <MenuItem value={"_"}>{t("company_default_setting")}</MenuItem>
              {Object.values(PayrollSalaryProrate).map((x, i) => (
                <MenuItem key={i} value={x}>
                  {t(x.toLowerCase())}
                </MenuItem>
              ))}
            </SelectFormsy>
          </Grid>
          {form.payrollBaseSalary?.prorate == PayrollSalaryProrate.MANUAL && (
            <Grid item xs={12} sm={6} md={3}>
              <TextFieldFormsy
                name="payrollBaseSalary.prorateManualDayCount"
                value={form.payrollBaseSalary.prorateManualDayCount ?? 0}
                variant="outlined"
                label={t("days_total").toString()}
                onChange={inputOnChange}
                validations="isInt,isExisty"
                debounce
                validationError={formsyErrorMessage(t, t("days_total")).isExisty}
                fullWidth
                required
              />
            </Grid>
          )}
        </Grid>

        <hr className="w-full my-16" />
      </React.Fragment>

      {props.isCreatePayroll && (
        <React.Fragment>
          <Typography variant="h6" component="h2" className="mb-16">
            {t("recapitulation")}
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextFieldFormsy
                name="payrollRecapitulation.workingDay"
                value={recapitulation?.workingDay ?? 0}
                onChange={(e) => recapitulationOnChange(e)}
                label={t("business_days").toString()}
                variant="outlined"
                validations="isInt,isExisty"
                debounce
                validationErrors={formsyErrorMessage(t, t("business_days"))}
                fullWidth
                required
                inputProps={{ style: { textAlign: "right" } }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t("days").toLowerCase()}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextFieldFormsy
                name="payrollRecapitulation.nonWorkingDay"
                value={recapitulation?.nonWorkingDay ?? 0}
                onChange={(e) => recapitulationOnChange(e)}
                label={t("non_business_days").toString()}
                helperText={t("include_weekends")}
                variant="outlined"
                validations="isInt,isExisty"
                debounce
                validationErrors={formsyErrorMessage(t, t("non_business_days"))}
                fullWidth
                required
                inputProps={{ style: { textAlign: "right" } }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t("days").toLowerCase()}</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          <hr className="my-16 mx-64" />
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextFieldFormsy
                name="payrollRecapitulation.attendanceWorkingDay"
                value={recapitulation?.attendanceWorkingDay ?? 0}
                onChange={(e) => recapitulationOnChange(e)}
                label={t("working_days").toString()}
                variant="outlined"
                validations="isInt,isExisty"
                debounce
                validationErrors={formsyErrorMessage(t, t("working_days"))}
                fullWidth
                required
                inputProps={{ style: { textAlign: "right" } }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t("days").toLowerCase()}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextFieldFormsy
                name="payrollRecapitulation.nonAttendanceWorkingDay"
                value={recapitulation?.nonAttendanceWorkingDay ?? 0}
                onChange={(e) => recapitulationOnChange(e)}
                label={t("absent_days").toString()}
                variant="outlined"
                validations="isInt,isExisty"
                debounce
                validationErrors={formsyErrorMessage(t, t("absent_days"))}
                fullWidth
                required
                inputProps={{ style: { textAlign: "right" } }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t("days").toLowerCase()}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextFieldFormsy
                name="payrollRecapitulation.leave"
                value={recapitulation?.leave ?? 0}
                onChange={(e) => recapitulationOnChange(e)}
                label={t("leave").toString()}
                variant="outlined"
                validations="isInt,isExisty"
                debounce
                validationErrors={formsyErrorMessage(t, t("leave"))}
                fullWidth
                required
                inputProps={{ style: { textAlign: "right" } }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t("days").toLowerCase()}</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          <hr className="my-16 mx-64" />
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextFieldFormsy
                name="payrollRecapitulation.checkInLate"
                value={recapitulation?.checkInLate ?? 0}
                onChange={(e) => recapitulationOnChange(e)}
                label={t("Clock In Late").toString()}
                variant="outlined"
                debounce
                validationErrors={formsyErrorMessage(t, t("business_days"))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextFieldFormsy
                name="payrollRecapitulation.checkOutEarly"
                value={recapitulation?.checkOutEarly ?? 0}
                onChange={(e) => recapitulationOnChange(e)}
                label={t("Clock Out Early").toString()}
                variant="outlined"
                debounce
                validationErrors={formsyErrorMessage(t, t("business_days"))}
                fullWidth
              />
            </Grid>
          </Grid>

          <hr className="w-full my-16" />
        </React.Fragment>
      )}

      <Typography variant="h6" component="h2" className="mb-16">
        {t("earning")}
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <PayrollTemplateComponentForm
            componentType={PayrollComponentType.EARNING}
            inputOnChange={inputOnChange}
            payrollComponents={payrollComponents}
            payrollComponentEmployees={form.payrollComponentEmployees ?? []}
            formAdd={formAdd}
            formDelete={formDelete}
            isEditPayslip={props.isEditPayslip}
          />
        </Grid>
        <Grid item xs={12}>
          <PayrollTemplateComponentForm
            componentType={PayrollComponentType.BENEFIT}
            inputOnChange={inputOnChange}
            payrollComponents={payrollComponents}
            payrollComponentEmployees={form.payrollComponentEmployees ?? []}
            formAdd={formAdd}
            formDelete={formDelete}
            isEditPayslip={props.isEditPayslip}
          />
        </Grid>
        <Grid item xs={12}>
          <PayrollTemplateComponentForm
            componentType={PayrollComponentType.DEDUCTION}
            inputOnChange={inputOnChange}
            payrollComponents={payrollComponents}
            payrollComponentEmployees={form.payrollComponentEmployees ?? []}
            formAdd={formAdd}
            formDelete={formDelete}
            isEditPayslip={props.isEditPayslip}
          />
        </Grid>
      </Grid>

      {props.renderAction && <div className="mt-16">{props.renderAction(isFormValid)}</div>}
    </Formsy>
  );
};

export const PayrollTemplateFormComponent = React.memo(_PayrollTemplateFormComponent);

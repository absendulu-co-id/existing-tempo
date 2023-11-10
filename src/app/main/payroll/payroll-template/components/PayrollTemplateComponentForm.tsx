import { PayrollAccordion, PayrollAccordionDetails, PayrollAccordionSummary } from "../../components/Accordion";
import TextFieldPercentageFormsy from "@/app/components/TextField/TextFieldPercentageFormsy";
import { PayrollService } from "@/app/services/payroll";
import { CheckboxFormsy, SelectFormsy, TextFieldFormsy } from "@fuse";
import { formsyErrorMessage } from "@fuse/components/formsy/FormsyErrorMessage";
import { Icon } from "@iconify-icon/react";
import { Button, Chip, Grid, IconButton, InputAdornment, MenuItem, Typography } from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MyFormattedNumber } from "app/components/MyFormattedNumber";
import TextFieldCurrencyFormsy from "app/components/TextField/TextFieldCurrencyFormsy";
import {
  PayrollAmountCalculation,
  PayrollAmountType,
  PayrollComponent,
  PayrollComponentEmployeeCreation,
  PayrollComponentType,
} from "interface";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  componentType: PayrollComponentType;
  payrollComponents: PayrollComponent[];
  payrollComponentEmployees: PayrollComponentEmployeeCreation[];
  inputOnChange: (event: React.ChangeEvent<any>, payrollComponentIndex?: number) => void;
  formAdd: (payrollComponentType: PayrollComponentType) => void;
  formDelete: (payrollComponentType: PayrollComponentType, _index?: number) => void;

  className?: string;
  style?: React.CSSProperties;
  isEditPayslip?: boolean;
}

const _PayrollTemplateComponentForm: React.FC<Props> = ({
  componentType,
  payrollComponents,
  payrollComponentEmployees,
  inputOnChange,
  ...props
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(true);

  const filteredPayrollComponents = payrollComponents.filter((x) => x.type == componentType);
  const filteredComponentEmplyoees = payrollComponentEmployees.filter((x) => x.type == componentType);

  const resetField = (name: string, payrollComponentId: number, index?: number) => {
    const component = filteredPayrollComponents.find((x) => x.payrollComponentId == payrollComponentId);
    if (component == null) return;

    const splittedName = name.split(".")[1];

    inputOnChange(
      {
        target: {
          name,
          value: component[splittedName],
        },
      } as any,
      index,
    );
  };

  return (
    <PayrollAccordion
      expanded={expanded}
      onChange={(_, e) => setExpanded(e)}
      className={props.className}
      style={props.style}
    >
      <PayrollAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{
          backgroundColor: `${PayrollService.backgroundColor(componentType)}99`,
        }}
      >
        <Typography component="div">
          {t(componentType.toLowerCase())}&nbsp;
          {componentType == PayrollComponentType.BENEFIT && <Icon icon="mdi:asterisk" />}
          <Chip
            label={
              <MyFormattedNumber
                value={filteredComponentEmplyoees.reduce(
                  (a, b) => a + parseInt((b.isEnabled ? b.amount ?? 0 : 0).toString()),
                  0,
                )}
              />
            }
            className="font-bold"
            size="small"
            style={{
              backgroundColor: cyan[800],
              color: "white",
            }}
          />
        </Typography>
      </PayrollAccordionSummary>
      <PayrollAccordionDetails className="block">
        {componentType == PayrollComponentType.BENEFIT && (
          <Typography component="p" variant="caption" className="text-gray-600">
            <Icon icon="mdi:asterisk" />
            {t("benefit_tooltip")}
          </Typography>
        )}
        <table className="rounded border-collapse w-full">
          <thead>
            <tr>
              {props.isEditPayslip != true && (
                <th className="px-2 py-1" style={{ width: "1%" }}>
                  {t("active")}
                </th>
              )}
              <th className="px-2 py-1" style={{ width: "1%" }}>
                <Icon icon="mdi:delete" />
              </th>
              <th className="px-2 py-1">{t("name")}*</th>
              <th className="px-2 py-1">{t("amount")}*</th>
              <th className="px-2 py-1">{t("amount_type")}*</th>
              <th className="px-2 py-1">{t("amount_calculation")}*</th>
              <th className="px-2 py-1">{t("fixed_allowance")}</th>
              <th className="px-2 py-1">{t("taxable")}</th>
              <th className="px-2 py-1">{t("internal_notes")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredComponentEmplyoees.length == 0 && (
              <tr>
                <td colSpan={99} className="border border-gray-400 px-2 py-1 text-gray-400 text-center">
                  <p>Tidak ada {t(componentType.toLowerCase())} untuk karyawan ini.</p>
                  <p>
                    Klik "<Icon icon="mdi:plus" /> Tambah {t(componentType.toLowerCase())}" untuk menambahkan
                  </p>
                </td>
              </tr>
            )}

            {payrollComponentEmployees.map((x, i) => {
              if (x.type != componentType) return null;

              const payrollComponent = filteredPayrollComponents.find(
                (y) => y.payrollComponentId == x.payrollComponentId,
              );

              const disabled = x._isSalary == true;

              return (
                <tr className={payrollComponentEmployees[i]?.isEnabled ? "" : "text-gray-500 bg-gray-300"} key={i}>
                  {props.isEditPayslip != true && (
                    <td className="border border-gray-400 px-2 py-1">
                      <CheckboxFormsy
                        checked={payrollComponentEmployees[i].isEnabled}
                        name={`payrollComponentEmployees[${i}].isEnabled`}
                        onChange={(e) => inputOnChange(e, x._index)}
                        size="small"
                        disabled={disabled}
                      />
                    </td>
                  )}
                  {x.payrollComponentId != null && <td className="border border-gray-400 px-4 py-2"></td>}
                  {x.payrollComponentId == null && (
                    <td className="border border-gray-400 px-4 py-2">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          props.formDelete(componentType, x._index);
                        }}
                        disabled={disabled}
                      >
                        <Icon icon="mdi:delete" />
                      </IconButton>
                    </td>
                  )}
                  <td className="border border-gray-400 px-2 py-1">
                    {
                      <TextFieldFormsy
                        value={payrollComponentEmployees[i].name}
                        onChange={(e) => inputOnChange(e, x._index)}
                        name={`payrollComponentEmployees[${i}].name`}
                        size="small"
                        fullWidth
                        required
                        debounce
                        validationError={formsyErrorMessage(t, t("name")).isExisty}
                        validationErrors={formsyErrorMessage(t, t("name"))}
                        disabled={disabled}
                        InputProps={{
                          endAdornment: x.payrollComponentId != null &&
                            payrollComponent?.name != null &&
                            x.name != payrollComponent.name && (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onClick={() =>
                                    resetField(`payrollComponentEmployees[${i}].name`, x.payrollComponentId!, x._index)
                                  }
                                >
                                  <Icon icon="mdi:restore" />
                                </IconButton>
                              </InputAdornment>
                            ),
                        }}
                      />
                    }
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {payrollComponentEmployees[i].amountType == PayrollAmountType.EXACT && (
                      <TextFieldCurrencyFormsy
                        name={`payrollComponentEmployees[${i}].amount`}
                        value={payrollComponentEmployees[i].amount}
                        onChange={(e) => inputOnChange(e, x._index)}
                        fullWidth
                        size="small"
                        required
                        debounce
                        validationError={formsyErrorMessage(t, t("amount")).isExisty}
                        validationErrors={formsyErrorMessage(t, t("amount"))}
                        disabled={disabled}
                        InputProps={{
                          endAdornment: x.payrollComponentId &&
                            payrollComponent?.amount != null &&
                            x.amount != payrollComponent.amount && (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onClick={() =>
                                    resetField(
                                      `payrollComponentEmployees[${i}].amount`,
                                      x.payrollComponentId!,
                                      x._index,
                                    )
                                  }
                                >
                                  <Icon icon="mdi:restore" />
                                </IconButton>
                              </InputAdornment>
                            ),
                        }}
                      />
                    )}

                    {[
                      PayrollAmountType.PERCENTAGE_SALARY,
                      PayrollAmountType.PERCENTAGE_SALARY_FIXED_ALLOWANCE,
                    ].includes(payrollComponentEmployees[i].amountType as any) && (
                      <TextFieldPercentageFormsy
                        required
                        name={`payrollComponentEmployees[${i}].amount`}
                        value={payrollComponentEmployees[i].amount}
                        onChange={(e) => inputOnChange(e, x._index)}
                        fullWidth
                        validations={{
                          matchRegexp: /^100(,0{0,2})? *%?$|^\d{1,2}(,\d{1,2})? *%?$/,
                        }}
                        debounce
                        validationError={formsyErrorMessage(t, t("amount")).isExisty}
                        validationErrors={formsyErrorMessage(t, t("amount"))}
                        disabled={disabled}
                        InputProps={{
                          endAdornment: x.payrollComponentId &&
                            payrollComponent?.amount != null &&
                            x.amount != payrollComponent.amount && (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onClick={() =>
                                    resetField(
                                      `payrollComponentEmployees[${i}].amount`,
                                      x.payrollComponentId!,
                                      x._index,
                                    )
                                  }
                                >
                                  <Icon icon="mdi:restore" />
                                </IconButton>
                              </InputAdornment>
                            ),
                        }}
                      />
                    )}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <SelectFormsy
                      name={`payrollComponentEmployees[${i}].amountType`}
                      value={payrollComponentEmployees[i].amountType}
                      onChange={(e) => inputOnChange(e, x._index)}
                      fullWidth
                      required
                      validationError={formsyErrorMessage(t, t("amount_type")).isExisty}
                      validationErrors={formsyErrorMessage(t, t("amount_type"))}
                      disabled={disabled}
                      endAdornment={
                        payrollComponent?.amountType != null &&
                        x.amountType != payrollComponent.amountType && (
                          <InputAdornment position="end" className="mr-16">
                            <IconButton
                              edge="end"
                              onClick={() =>
                                resetField(
                                  `payrollComponentEmployees[${i}].amountType`,
                                  x.payrollComponentId!,
                                  x._index,
                                )
                              }
                            >
                              <Icon icon="mdi:restore" />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    >
                      {Object.keys(PayrollAmountType).map((x, i) => (
                        <MenuItem key={i} value={x}>
                          {t(x.toLowerCase())}
                          {x == "DAILY" && ` (${t("daily_includes_holiday")})`}
                        </MenuItem>
                      ))}
                    </SelectFormsy>
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <SelectFormsy
                      name={`payrollComponentEmployees[${i}].amountCalculation`}
                      value={payrollComponentEmployees[i].amountCalculation}
                      onChange={(e) => inputOnChange(e, x._index)}
                      fullWidth
                      required
                      validationError={formsyErrorMessage(t, t("amount_calculation")).isExisty}
                      validationErrors={formsyErrorMessage(t, t("amount_calculation"))}
                      disabled={disabled}
                      endAdornment={
                        payrollComponent?.amountCalculation != null &&
                        x.amountCalculation != payrollComponent.amountCalculation && (
                          <InputAdornment position="end" className="mr-16">
                            <IconButton
                              edge="end"
                              onClick={() =>
                                resetField(
                                  `payrollComponentEmployees[${i}].amountCalculation`,
                                  x.payrollComponentId!,
                                  x._index,
                                )
                              }
                            >
                              <Icon icon="mdi:restore" />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    >
                      {Object.keys(PayrollAmountCalculation).map((x, i) => (
                        <MenuItem key={i} value={x}>
                          {t(x.toLowerCase())}
                          {x == "DAILY" && ` (${t("daily_includes_holiday")})`}
                        </MenuItem>
                      ))}
                    </SelectFormsy>
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <Grid container spacing={0} alignItems="center" justifyContent="center">
                      <Grid item xs={6}>
                        <CheckboxFormsy
                          checked={payrollComponentEmployees[i].isFixedAllowance ?? false}
                          name={`payrollComponentEmployees[${i}].isFixedAllowance`}
                          onChange={(e) => inputOnChange(e, x._index)}
                          disabled={disabled}
                        />
                      </Grid>

                      {payrollComponent?.isFixedAllowance != null &&
                        x.isFixedAllowance != payrollComponent.isFixedAllowance && (
                          <Grid item xs={6}>
                            <IconButton
                              onClick={() =>
                                resetField(
                                  `payrollComponentEmployees[${i}].isFixedAllowance`,
                                  x.payrollComponentId!,
                                  x._index,
                                )
                              }
                            >
                              <Icon icon="mdi:restore" />
                            </IconButton>
                          </Grid>
                        )}
                    </Grid>
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <Grid container spacing={0} alignItems="center" justifyContent="center">
                      <Grid item xs={6}>
                        <CheckboxFormsy
                          checked={payrollComponentEmployees[i].isTaxable ?? false}
                          name={`payrollComponentEmployees[${i}].isTaxable`}
                          onChange={(e) => inputOnChange(e, x._index)}
                          disabled={disabled}
                        />
                      </Grid>
                      {payrollComponent?.isTaxable != null && x.isTaxable != payrollComponent.isTaxable && (
                        <Grid item xs={6}>
                          <IconButton
                            onClick={() =>
                              resetField(`payrollComponentEmployees[${i}].isTaxable`, x.payrollComponentId!, x._index)
                            }
                          >
                            <Icon icon="mdi:restore" />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <TextFieldFormsy
                      value={payrollComponentEmployees[i].notes}
                      onChange={(e) => inputOnChange(e, x._index)}
                      name={`payrollComponentEmployees[${i}].notes`}
                      size="small"
                      debounce
                      fullWidth
                      disabled={disabled}
                      InputProps={{
                        endAdornment: x.payrollComponentId &&
                          payrollComponent?.notes != null &&
                          x.notes != payrollComponent.notes && (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() =>
                                  resetField(`payrollComponentEmployees[${i}].notes`, x.payrollComponentId!, x._index)
                                }
                              >
                                <Icon icon="mdi:restore" />
                              </IconButton>
                            </InputAdornment>
                          ),
                      }}
                    />
                  </td>
                </tr>
              );
            })}
            <tr className="border border-gray-400 px-4 py-2">
              <td colSpan={99} className="p-4">
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  startIcon={<Icon icon="mdi:plus" />}
                  fullWidth
                  onClick={() => {
                    props.formAdd(componentType);
                  }}
                >
                  Tambah {t(componentType.toLowerCase())}
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </PayrollAccordionDetails>
    </PayrollAccordion>
  );
};

export const PayrollTemplateComponentForm = React.memo(_PayrollTemplateComponentForm);

import { PayrollAccordion, PayrollAccordionDetails, PayrollAccordionSummary } from "../../components/Accordion";
import { PayrollService } from "@/app/services/payroll";
import { Icon } from "@iconify-icon/react";
import { Checkbox, Chip, Typography, useTheme } from "@material-ui/core";
import { cyan, grey, red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { PayslipDetail } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { MyFormattedNumber } from "app/components/MyFormattedNumber";
import {
  PayrollAmountType,
  PayrollComponent,
  PayrollComponentEmployee,
  PayrollComponentEmployeeCreation,
  PayrollComponentType,
} from "interface";
import cloneDeep from "lodash/cloneDeep";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface BaseProps {
  componentType: PayrollComponentType;
  payslipDetails?: PayslipDetail[];
  payrollComponentEmployees?: PayrollComponentEmployeeCreation[];
  payrollComponents?: PayrollComponent[];
  className?: string;
  style?: React.CSSProperties;
  isCreatePayroll?: boolean;
}
type Props = BaseProps &
  ({ payrollComponentEmployees?: PayrollComponentEmployeeCreation[] } | { payslipDetails: PayslipDetail[] });

export const PayrollTemplateComponentMiniTable: React.FC<Props> = ({
  componentType,
  payrollComponents,
  payrollComponentEmployees,
  payslipDetails,
  isCreatePayroll,
  ...props
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [data, setData] = useState<Partial<PayrollComponentEmployee | PayslipDetail>[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);

  const filteredPayrollComponents = payrollComponents?.filter((x) => x.type == componentType) ?? [];
  const filteredData = data.filter((x) => ("isEnabled" in x! ? x!.isEnabled : true));

  useEffect(() => {
    const _data = [
      ...cloneDeep(filteredPayrollComponents)
        .map((x1) => {
          const x: Partial<PayrollComponentEmployeeCreation> = x1;

          const componentEmployee = payrollComponentEmployees?.find(
            (y) => y.payrollComponentId == x.payrollComponentId && y.isEnabled,
          );
          x.notes ??= "";
          x.isEnabled = false;
          if (componentEmployee == null) return null;

          if (componentEmployee.payrollComponentEmployeeId != null)
            x.payrollComponentEmployeeId = componentEmployee.payrollComponentEmployeeId;
          if (componentEmployee.amount != null) x.amount = componentEmployee.amount;
          if (componentEmployee.name != null) x.name = componentEmployee.name;
          if (componentEmployee.notes != null) x.notes = componentEmployee.notes;
          x.isEnabled = componentEmployee.isEnabled;
          return x;
        })
        .filter((x) => x != null),
      ...(cloneDeep(payrollComponentEmployees)
        ?.filter((x) => x.payrollComponentId == null && x.type == componentType)
        .map((x) => {
          x.notes ??= "";
          return x;
        }) ?? []),
      ...(cloneDeep(payslipDetails)
        ?.filter((x) => x.type == componentType)
        .map((x) => {
          x.notes ??= "";
          return x;
        }) ?? []),
    ];
    if (!expanded) {
      setExpanded(_data.filter((x) => ("isEnabled" in x! ? x!.isEnabled : true)).length != 0);
    }

    setData(_data as any);
  }, [payrollComponentEmployees, payrollComponents]);

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
          {t(componentType.toLowerCase())}
          {componentType == PayrollComponentType.BENEFIT && <Icon icon="mdi:asterisk" />}
          &nbsp;
          <Chip
            label={
              <MyFormattedNumber
                value={data.reduce(
                  (a, b) => a + parseInt((("isEnabled" in b ? b.isEnabled : true) ? b.amount ?? 0 : 0).toString()),
                  0,
                )}
              />
            }
            className="font-bold"
            size="small"
            style={{
              backgroundColor: componentType == PayrollComponentType.DEDUCTION ? red[800] : cyan[800],
              color: "white",
            }}
          />
        </Typography>
      </PayrollAccordionSummary>
      <PayrollAccordionDetails>
        {filteredData.length == 0 && (
          <Typography className="text-center w-full my-8" style={{ color: grey[500] }}>
            Tidak ada {t(componentType.toLowerCase())} untuk karyawan ini.
            <br />
            Silahkan klik <Icon icon="mdi:pencil" /> untuk menambahkan {t(componentType.toLowerCase())}
          </Typography>
        )}
        {filteredData.length != 0 && (
          <table className="rounded border-collapse w-full">
            <thead>
              <tr>
                <th className="px-2 py-1">{t("name")}*</th>
                <th className="px-2 py-1">{t("amount")}*</th>
                <th className="px-2 py-1">{t("amount_type")}*</th>
                <th className="px-2 py-1">{t("amount_calculation")}*</th>
                {isCreatePayroll && <th className="px-2 py-1">{t("total")}</th>}
                <th className="px-2 py-1">{t("fixed_allowance")}</th>
                <th className="px-2 py-1">{t("taxable")}</th>
                <th className="px-2 py-1">{t("internal_notes")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .sort((a, b) =>
                  [PayrollService.salaryComponentName, PayrollService.salaryDeductionComponentName].includes(
                    b.name ?? "",
                  )
                    ? 1
                    : 0,
                )
                .map((x, i) => {
                  const payrollComponent =
                    "payrollComponentId" in x
                      ? filteredPayrollComponents.find((y) => y.payrollComponentId == x.payrollComponentId)
                      : null;

                  return (
                    <tr
                      key={i}
                      style={{ ...((x as any)._isSalary ? { backgroundColor: theme.palette.primary.main } : {}) }}
                    >
                      <td className="border border-gray-400 px-2 py-1">
                        {payrollComponent != null && x.name != payrollComponent.name && (
                          <p className="text-gray-400">
                            <del>{payrollComponent.name}</del>
                          </p>
                        )}

                        <p>
                          {("payrollComponentId" in x || "payrollComponentEmployeeId" in x) &&
                            (x.payrollComponentId == null ||
                              (x.payrollComponentEmployeeId != null && x.payrollComponentEmployeeId < 1)) && (
                              <Icon icon="mdi:creation" />
                            )}
                          &nbsp;
                          {x.name ?? payrollComponent?.name}
                        </p>
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {payrollComponent?.amount}
                        {payrollComponent != null && x.amount != payrollComponent.amount && (
                          <p className="text-gray-400">
                            <del>
                              <MyFormattedNumber
                                style={x.amountType != PayrollAmountType.EXACT ? "percent" : "currency"}
                                value={payrollComponent.amount}
                              />
                            </del>
                          </p>
                        )}
                        <p>
                          <MyFormattedNumber
                            style={["", PayrollAmountType.EXACT].includes(x.amountType ?? "") ? "currency" : "percent"}
                            value={parseFloat((x.amount ?? 0).toString())}
                          />
                        </p>
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {payrollComponent != null && x.amountType != payrollComponent.amountType && (
                          <p className="text-gray-400">
                            <del>{t(payrollComponent.amountType.toLowerCase())}</del>
                          </p>
                        )}

                        <p>{t(x.amountType?.toLowerCase() ?? "")}</p>
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {payrollComponent != null && x.amountCalculation != payrollComponent.amountCalculation && (
                          <p className="text-gray-400">
                            <del>{t(payrollComponent.amountCalculation.toLowerCase())}</del>
                          </p>
                        )}

                        <p>{t(x.amountCalculation?.toLowerCase() ?? "")}</p>
                      </td>
                      {isCreatePayroll && (
                        <td className="border border-gray-400 px-2 py-1">
                          {payrollComponent != null && x.amount != payrollComponent.amount && (
                            <p className="text-gray-400">
                              <del>
                                <MyFormattedNumber
                                  style={x.amountType != PayrollAmountType.EXACT ? "percent" : "currency"}
                                  value={payrollComponent.amount}
                                />
                              </del>
                            </p>
                          )}
                          <p>
                            <MyFormattedNumber
                              style="currency"
                              value={parseFloat(((x as any).total ?? 0).toString())}
                            />
                          </p>
                        </td>
                      )}
                      <td className="border border-gray-400 px-2 py-1">
                        <Checkbox checked={x.isFixedAllowance} readOnly />
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        <Checkbox checked={x.isTaxable} readOnly />
                      </td>
                      <td className="border border-gray-400 px-4 py-1">
                        {payrollComponent != null && x.notes != payrollComponent.notes && (
                          <p className="text-gray-400">
                            <del>{payrollComponent.notes}</del>
                          </p>
                        )}
                        <p>{x.notes ?? payrollComponent?.notes}</p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </PayrollAccordionDetails>
      {componentType == PayrollComponentType.BENEFIT && (
        <Typography component="p" variant="caption" className="text-gray-600">
          <Icon icon="mdi:asterisk" />
          {t("benefit_tooltip")}
        </Typography>
      )}
    </PayrollAccordion>
  );
};

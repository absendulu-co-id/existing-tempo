import { MyFormattedNumber } from "app/components/MyFormattedNumber";
import { PayrollTemplate } from "interface";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props<RowData extends Object = PayrollTemplate> {
  rowData: RowData;
}

export const PayrollBaseSalaryMiniTable: React.FC<Props> = ({ rowData }) => {
  const { t } = useTranslation();

  // if (edit) {
  //   return <Grid container spacing={2}>
  //     <Grid item xs={12}>
  //       <TextFieldCurrency
  //         variant="outlined"
  //         name="currency"
  //         value={rowData.payrollBaseSalary?.salary}
  //         onChange={() => console.log("a")}
  //         required
  //         fullWidth
  //         label={t("salary")}
  //       />
  //     </Grid>
  //     <Grid item xs={12}>
  //       <FormControl required variant="outlined" fullWidth>
  //         <InputLabel>{t("period")}</InputLabel>
  //         <Select
  //           value={rowData.payrollBaseSalary?.period}
  //           label={t("period")}
  //           required
  //         >
  //           <MenuItem disabled>{t("select_", { _: t("period") })}</MenuItem>
  //           <MenuItem value="MONTHLY">{t("monthly")}</MenuItem>
  //           <MenuItem value="WEEKLY">{t("weekly")}</MenuItem>
  //           <MenuItem value="HOURLY">{t("hourly")}</MenuItem>
  //         </Select>
  //       </FormControl>
  //     </Grid>
  //   </Grid>;
  // }

  return (
    <table>
      <tbody>
        <tr>
          <th>{t("salary")}</th>
          <td>
            <MyFormattedNumber value={rowData.payrollBaseSalary?.salary ?? 0} />
          </td>
        </tr>
        <tr>
          <th>{t("period")}</th>
          <td>{t(rowData.payrollBaseSalary?.period.toLowerCase() ?? "-")}</td>
        </tr>
        <tr>
          <th>{t("prorate")}</th>
          <td>{t(rowData.payrollBaseSalary?.prorate?.toLowerCase() ?? "-")}</td>
        </tr>
        {rowData.payrollBaseSalary?.prorate == "MANUAL" && (
          <tr>
            <th>{t("total_days")}</th>
            <td>
              <MyFormattedNumber value={rowData.payrollBaseSalary.prorateManualDayCount ?? 0} style="decimal" />
            </td>
          </tr>
        )}
        {/* <tr>
        <th>Lembur</th>
        <td><MyFormattedNumber value={rowData.payrollOvertime?.amount ?? 0} /></td>
      </tr> */}
      </tbody>
    </table>
  );
};

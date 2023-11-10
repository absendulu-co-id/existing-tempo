// import { CalculateTakeHomepay, calculateTakeHomePay } from "../payrollConfig";
// import { PayslipDetail } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
// import { MyFormattedNumber } from "app/components/MyFormattedNumber";
// import { PayrollBaseSalary, PayrollComponentEmployee, ReportRecapitulation } from "interface";
// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// interface _Props {
//   payrollBaseSalary: PayrollBaseSalary | null;
//   payrollComponentEmployees?: PayrollComponentEmployee[];
//   payslipDetails?: PayslipDetail[];
//   recapitulation: ReportRecapitulation | null;
// }

// export type Props = _Props &
//   ({ payrollComponentEmployees: PayrollComponentEmployee[] } | { payslipDetails?: PayslipDetail[] });

// const _PayrollThpMiniTable: React.FC<Props> = ({
//   payrollBaseSalary,
//   payrollComponentEmployees,
//   payslipDetails,
//   recapitulation,
//   ...props
// }) => {
//   const [thp, setThp] = useState<CalculateTakeHomepay>();
//   const { t } = useTranslation();

//   useEffect(() => {
//     const calculateThp = calculateTakeHomePay({
//       payrollBaseSalary,
//       payrollComponentEmployees,
//       payslipDetails,
//       recapitulation: null,
//     });
//     setThp(calculateThp);
//   }, [payrollBaseSalary, payrollComponentEmployees, payslipDetails, recapitulation]);

//   if (thp == null) {
//     return <div></div>;
//   }

//   return (
//     <table>
//       <tbody>
//         <tr>
//           <th>{t("earning")}</th>
//           <td>
//             <MyFormattedNumber value={thp.earning} />
//           </td>
//         </tr>
//         <tr>
//           <th>{t("deduction")}</th>
//           <td>
//             <MyFormattedNumber value={thp.deduction * -1} />
//           </td>
//         </tr>
//         <tr>
//           <th>{t("take_home_pay")}</th>
//           <td>
//             <MyFormattedNumber value={thp.takeHomePay} />
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   );
// };

// export const PayrollThpMiniTable = React.memo(_PayrollThpMiniTable);

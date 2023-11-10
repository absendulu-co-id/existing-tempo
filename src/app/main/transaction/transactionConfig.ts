import { attendanceReportConfig } from "./attendance_report/Config";
import { inOutConfig } from "./InOut/Config";
import { mobileLogConfig } from "./mobile_log/Config";
import { recapitulationReportConfig } from "./recapitulation/Config";
import { employeeRosterReportConfig } from "./roster/Config";
import { statusReportConfig } from "./Status/Config";
import { transactionListConfig } from "./transaction/Config";

export const transactionConfig = [
  transactionListConfig,
  attendanceReportConfig,
  inOutConfig,
  statusReportConfig,
  employeeRosterReportConfig,
  recapitulationReportConfig,
  mobileLogConfig,
];

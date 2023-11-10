import { PayrollReport } from "../payroll";

export interface _PayrollReportSummary {
  salary: number;
  allowance: number;
  deduction: number;
  benefit: number;
  takeHomePay: number;
}

export type PayrollReportSummary = Omit<PayrollReport<_PayrollReportSummary>, "reports">;

export type PayrollReportByDepartment = Omit<PayrollReport<Record<string, _PayrollReportSummary>>, "report">;

export interface _PayrollReportByDepartmentTransposed extends _PayrollReportSummary {
  department: string;
}

export type PayrollReportByDepartmentTransposed = Omit<PayrollReport<_PayrollReportByDepartmentTransposed>, "report">;

export interface _PayrollReportByComponent {
  DEDUCTION?: Record<string, number>;
  EARNING?: Record<string, number>;
  BENEFIT?: Record<string, number>;
}

export type PayrollReportByComponent = Omit<PayrollReport<string>, "report">;

import {
  Payroll as _Payroll,
  PayrollBaseSalary as _PayrollBaseSalary,
  PayrollComponent as _PayrollComponent,
  PayrollComponentEmployee as _PayrollComponentEmployee,
  Payslip as _Payslip,
  Employee,
} from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { CreationAttributes } from "sequelize";

export enum PayrollBaseSalaryPeriod {
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY",
  DAILY = "DAILY",
  HOURLY = "HOURLY",
}

export enum PayrollTaxCalculation {
  GROSS = "GROSS",
  GROSS_UP = "GROSS_UP",
  NETT = "NETT",
}

export enum PayrollComponentType {
  EARNING = "EARNING",
  DEDUCTION = "DEDUCTION",
  BENEFIT = "BENEFIT",
}

export enum PayrollAmountType {
  EXACT = "EXACT",
  PERCENTAGE_SALARY = "PERCENTAGE_SALARY",
  PERCENTAGE_SALARY_FIXED_ALLOWANCE = "PERCENTAGE_SALARY_FIXED_ALLOWANCE",
}

export enum PayrollAmountCalculation {
  FIXED = "FIXED",
  WORKING_HOURS = "WORKING_HOURS",
  WORKING_DAYS = "WORKING_DAYS",
  BUSINESS_DAYS = "BUSINESS_DAYS",
  BUSINESS_DAYS_HOLIDAY = "BUSINESS_DAYS_HOLIDAY",
  DAILY = "DAILY",
}

export enum PayrollSalaryProrate {
  WORKING_HOURS = "WORKING_HOURS",
  WORKING_DAYS = "WORKING_DAYS",
  BUSINESS_DAYS = "BUSINESS_DAYS",
  BUSINESS_DAYS_HOLIDAY = "BUSINESS_DAYS_HOLIDAY",
  DAILY = "DAILY",
  MANUAL = "MANUAL",
}

export interface PayrollComponent extends _PayrollComponent {
  amountType: PayrollAmountType;
  amountCalculation: PayrollAmountCalculation;
  type: PayrollComponentType;
}

export interface Payroll extends Omit<_Payroll, "cutoffStart" | "cutoffEnd"> {
  cutoffStart: moment.Moment;
  cutoffEnd: moment.Moment;

  payslipCount?: number;
}

export type PayrollCreation = Omit<CreationAttributes<Payroll>, "period" | "cutoffStart" | "cutoffEnd"> & {
  period: moment.Moment;
  cutoffStart: moment.Moment;
  cutoffEnd: moment.Moment;
};

export type PayrollComponentEmployeeCreation = Omit<
  CreationAttributes<PayrollComponentEmployee>,
  "payrollComponentId"
> & {
  payrollComponentId?: number | null;
  _index?: number;
  _isSalary?: boolean;
};

export interface PayrollComponentEmployee extends Omit<_PayrollComponentEmployee, "payrollComponentId"> {
  payrollComponentId?: number | null;
  _index?: number;
}

export interface PayrollBaseSalary extends _PayrollBaseSalary {
  period: PayrollBaseSalaryPeriod;
  prorate: PayrollSalaryProrate;
}

export interface PayrollTemplate extends Omit<Employee, "payrollComponentEmployees"> {
  payrollComponentEmployees: PayrollComponentEmployeeCreation[];
  payrollBaseSalary?: CreationAttributes<PayrollBaseSalary>;
  positionCode: string;
  positionName: string;
  departmentName: string;
  departmentCode: string;
  areaName: string;

  takeHomePay?: number;
  components?: {
    [key in PayrollComponentType]: PayrollComponentEmployee;
  };
}

export interface Payslip extends _Payslip {
  takeHomePay?: number;
}

export interface PayrollReport<T>
  extends Exclude<
    Payroll,
    "header" | "footer" | "isFinal" | "isShowConfidential" | "isProtectPdf" | "updatedAt" | "deletedAt"
  > {
  payslipCount: number;
  report: T; // Please Omit one of this
  reports: T[]; // Please Omit one of this
}

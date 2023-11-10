import {
  Payroll,
  PayrollAmountCalculation,
  PayrollAmountType,
  PayrollComponent,
  PayrollComponentEmployeeCreation,
  PayrollComponentType,
  PayrollCreation,
  PayrollTemplate,
  Payslip,
  ReportRecapitulation,
} from "@/interface";
import { green, red, yellow } from "@material-ui/core/colors";
import { Holiday, PayslipDetail } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import Axios from "axios";
import { CreationAttributes } from "sequelize";
import Swal from "sweetalert2/dist/sweetalert2.js";

export interface CalculateTakeHomepay {
  earning: number;
  deduction: number;
  template: PayrollTemplate;
}

class _PayrollService {
  readonly salaryComponentName = "Gaji";
  readonly salaryDeductionComponentName = "Potongan Gaji";

  backgroundColor(componentType: PayrollComponentType) {
    switch (componentType) {
      case PayrollComponentType.BENEFIT:
        return yellow[300];
      case PayrollComponentType.DEDUCTION:
        return red.A200;
      case PayrollComponentType.EARNING:
        return green[400];
    }
  }

  calculate(p: {
    template: PayrollTemplate;
    recapitulation: Readonly<ReportRecapitulation> | null;
    payroll: Readonly<PayrollCreation> | null;
    holidays: Readonly<Holiday[]> | null;
    payrollComponents: Readonly<PayrollComponent[]> | null;
  }): CalculateTakeHomepay {
    const { recapitulation, payroll, holidays, payrollComponents } = p;
    let template = p.template;

    const salary = template.payrollBaseSalary?.salary ?? 0;

    if (salary > 0 && recapitulation != null) {
      switch (template.payrollBaseSalary?.period) {
        case "MONTHLY": {
          template = this.salaryMonthly({ template });
          template = this.salaryProrateMonthly({ template, recapitulation, payroll, holidays });
          break;
        }
        case "DAILY":
          throw new Error("HORLY not implemented");
        // salary = salary * recapitulation.attendanceWorkingDay;
        // break;
        case "HOURLY":
          throw new Error("HORLY not implemented");
        // break;
        default:
          break;
      }
    }

    template = this.component({ template, payrollComponents });
    template = this.componentCalculation({ template });

    const thp = this.calculateTakeHomePay({ template });
    template.takeHomePay = thp.takeHomePay;

    return {
      template,
      earning: thp.earning,
      deduction: thp.deduction,
    };
  }

  async createPayroll(p: {
    templates: PayrollTemplate[];
    payroll: PayrollCreation;
    payrollComponents: PayrollComponent[];
    recapitulations: ReportRecapitulation[];
    isCreatorHidden: boolean;
  }) {
    try {
      const { templates, recapitulations, payroll, payrollComponents, isCreatorHidden } = p;

      let payslips: CreationAttributes<Payslip>[] = templates.map((template) => {
        const recapitulation = recapitulations.find((x) => x.employeeId == template.employeeId);

        const payslipDetails: CreationAttributes<PayslipDetail>[] = template.payrollComponentEmployees.map((x) => {
          const component = payrollComponents.find((y) => y.payrollComponentId == x.payrollComponentId);

          return {
            payslipId: 0,
            type: x.type ?? component?.type ?? "BENEFIT",
            name: x.name ?? component?.name ?? "",
            notes: x.notes ?? component?.notes,
            amount: x.amount ?? component?.amount ?? 0,
            amountCalculation: x.amountCalculation ?? component?.amountCalculation ?? "FIXED",
            isFixedAllowance: x.isFixedAllowance ?? component?.isFixedAllowance,
            isTaxable: x.isTaxable ?? component?.isTaxable,
            multiplier: 0, // TODO
            total: 0, // TODO
          };
        });
        const salaryProrate = template.payrollBaseSalary?.prorate;

        const payslip: CreationAttributes<Payslip> & { payslipDetails: CreationAttributes<PayslipDetail>[] } = {
          employeeId: template.employeeId,
          employeeName: template.employeeName ?? "",
          positionName: template.positionName,
          departmentName: template.departmentName,
          areaName: template.areaIdAreas.map((x) => x.areaName).join(", "),
          workingDays: recapitulation?.workingDay ?? 0,
          presentDays: recapitulation?.attendanceWorkingDay ?? 0,
          leaveDays: recapitulation?.leave ?? 0,
          absentDays: recapitulation?.absent ?? 0,
          lateDays: 0, // TODO
          workingTime: 0, // TODO
          salaryProrate: (salaryProrate?.toString() == "_" ? "MANUAL" : salaryProrate) ?? "MANUAL",
          salaryProrateAmount: 0, // TODO
          salaryProrateManualDayCount: template.payrollBaseSalary?.prorateManualDayCount ?? 0,
          salary: template.payrollBaseSalary?.salary ?? 0,
          salaryPeriod: template.payrollBaseSalary?.period ?? "MONTHLY",
          nanoidUrl: "",
          payrollId: 0,
          payslipDetails: payslipDetails,
        };

        return payslip;
      });

      const resPayroll = await Axios.post<Payroll>("v1/payroll", {
        ...payroll,
        period: payroll.period.format("MMMM YYYY"),
        creatorName: !isCreatorHidden ? payroll.creatorName : undefined,
        creatorPosition: !isCreatorHidden ? payroll.creatorPosition : undefined,
        isFinal: false,
      });
      const finalPayroll = resPayroll.data;

      payslips = payslips.map((x) => {
        x.payrollId = finalPayroll.payrollId;
        return x;
      });

      await Axios.post(`v1/payslip/bulk/${finalPayroll.payrollId!}`, payslips);

      await Swal.fire({
        title: "Success",
        icon: "success",
        text: "Create payroll success!",
      });

      return finalPayroll;
    } catch (error: any) {
      console.error(error);
      await Swal.fire({
        title: "Error",
        icon: "error",
        text: error.message,
      });
      return null;
    }
  }

  private salaryMonthly(p: { template: PayrollTemplate }) {
    const { template } = p;

    const salary = template.payrollBaseSalary?.salary ?? 0;

    const salaryComponent: PayrollComponentEmployeeCreation & CreationAttributes<PayslipDetail> = {
      name: this.salaryComponentName,
      type: PayrollComponentType.EARNING,
      isEnabled: true,
      employeeId: template.employeeId,
      amount: salary,
      amountType: "EXACT",
      amountCalculation: "FIXED",
      isFixedAllowance: false,
      isTaxable: false,
      payrollComponentId: null,
      total: salary,
      payslipId: 0,
      multiplier: 0,
      _isSalary: true,
    };

    const indexSalary = template.payrollComponentEmployees.findIndex((x) => x.name == this.salaryComponentName);
    if (indexSalary == -1) {
      template.payrollComponentEmployees.unshift(salaryComponent);
    } else {
      template.payrollComponentEmployees[indexSalary] = salaryComponent;
    }
    return template;
  }

  private salaryProrateMonthly(p: {
    template: PayrollTemplate;
    holidays: Readonly<Holiday[]> | null;
    payroll: Readonly<PayrollCreation> | null;
    recapitulation: Readonly<ReportRecapitulation>;
  }) {
    const { template, recapitulation } = p;

    const salary = template.payrollComponentEmployees.find((x) => x.name == this.salaryComponentName)?.amount;
    if (salary == null) {
      return template;
    }

    switch (template.payrollBaseSalary?.prorate) {
      case "BUSINESS_DAYS": {
        const prorateMultiplier =
          (recapitulation.attendanceWorkingDay + recapitulation.leave) / recapitulation.workingDay;
        this.salaryDeduction({ template, salary, prorateMultiplier });

        break;
      }
      case "BUSINESS_DAYS_HOLIDAY": {
        // TODO
        throw new Error("BUSINESS_DAYS_HOLIDAY not implemented");
        break;
      }
      case "DAILY": {
        // TODO
        throw new Error("DAILY not implemented");
        break;
      }
      case "MANUAL": {
        // TODO
        throw new Error("MANUAL not implemented");
        break;
      }
      case "WORKING_DAYS": {
        // TODO
        throw new Error("WORKING_DAYS not implemented");
        break;
      }
      case "WORKING_HOURS": {
        // TODO
        throw new Error("WORKING_HOURS not implemented");
        break;
      }
    }

    return template;
  }

  private salaryDeduction(p: { template: PayrollTemplate; salary: number; prorateMultiplier: number }) {
    const { template, salary, prorateMultiplier } = p;

    const newSalary = salary * prorateMultiplier;

    if (newSalary != salary) {
      const prorate = salary * (prorateMultiplier - 1);

      const salaryDeductionComponent: PayrollComponentEmployeeCreation & CreationAttributes<PayslipDetail> = {
        isEnabled: true,
        employeeId: template.employeeId,
        amount: prorate * -1,
        name: this.salaryDeductionComponentName,
        type: PayrollComponentType.DEDUCTION,
        amountType: "EXACT",
        amountCalculation: "FIXED",
        multiplier: prorateMultiplier,
        total: prorate * -1,
        payslipId: 0,
        payrollComponentId: null,
      };

      const indexSalaryDeduction = template.payrollComponentEmployees.findIndex(
        (x) => x.name == this.salaryDeductionComponentName,
      );
      if (indexSalaryDeduction == -1) {
        template.payrollComponentEmployees.unshift(salaryDeductionComponent);
      } else {
        template.payrollComponentEmployees[indexSalaryDeduction] = salaryDeductionComponent;
      }
    }
    return template;
  }

  private component(p: { template: PayrollTemplate; payrollComponents: Readonly<PayrollComponent[] | null> }) {
    const { template, payrollComponents } = p;

    template.payrollComponentEmployees = template.payrollComponentEmployees.map((x1) => {
      const x = x1 as PayrollComponentEmployeeCreation & CreationAttributes<PayslipDetail>;
      if (x.payrollComponentId != null) {
        const payrollComponent = payrollComponents?.find((y) => y.payrollComponentId == x.payrollComponentId);
        if (payrollComponent != null) {
          x.name ??= payrollComponent.name;
          x.notes ??= payrollComponent.notes;
          x.amount ??= payrollComponent.amount;
          x.amountType ??= "EXACT";
          x.amountCalculation ??= payrollComponent.amountCalculation;
          x.multiplier ??= 0;
          x.total ??= payrollComponent.amount;
          x.isFixedAllowance ??= payrollComponent.isFixedAllowance;
          x.isTaxable ??= payrollComponent.isTaxable;
          x.payslipId ??= 0;
        }
      }
      return x;
    });

    return template;
  }

  private componentCalculation(p: { template: PayrollTemplate }) {
    const { template } = p;

    template.payrollComponentEmployees = template.payrollComponentEmployees.map((x1) => {
      const x = x1 as PayrollComponentEmployeeCreation & CreationAttributes<PayslipDetail>;

      switch (x.amountCalculation) {
        case PayrollAmountCalculation.FIXED:
          break;
        case PayrollAmountCalculation.WORKING_HOURS:
          x.total = x.amount * x.multiplier;
          break;
        case PayrollAmountCalculation.WORKING_DAYS:
          x.total = x.amount * x.multiplier;
          break;
        case PayrollAmountCalculation.BUSINESS_DAYS:
          x.total = x.amount * x.multiplier;
          break;
        case PayrollAmountCalculation.BUSINESS_DAYS_HOLIDAY:
          x.total = x.amount * x.multiplier;
          break;
        case PayrollAmountCalculation.DAILY:
          x.total = x.amount * x.multiplier;
          break;
        default:
          break;
      }

      switch (x.amountType) {
        case PayrollAmountType.EXACT:
          x.amount = x.total;
          break;
        case PayrollAmountType.PERCENTAGE_SALARY:
          x.amount = x.total / 100;
          break;
        case PayrollAmountType.PERCENTAGE_SALARY_FIXED_ALLOWANCE:
          x.amount = x.total / 100;
          break;
        default:
          break;
      }

      return x;
    });

    return template;
  }

  calculateTakeHomePay(p: { template: PayrollTemplate | Payslip }) {
    const { template } = p;
    let earningArray: (number | undefined)[] = [];
    let deductionArray: (number | undefined)[] = [];

    if ("payslipDetails" in template) {
      earningArray = template.payslipDetails.filter((x) => x.type == PayrollComponentType.EARNING).map((x) => x.amount);

      deductionArray = template.payslipDetails
        .filter((x) => x.type == PayrollComponentType.DEDUCTION)
        .map((x) => x.amount);
    } else if ("payrollComponentEmployees" in template) {
      earningArray = template.payrollComponentEmployees
        .filter((x) => x.type == PayrollComponentType.EARNING && x.isEnabled)
        .map((x) => x.amount);

      deductionArray = template.payrollComponentEmployees
        .filter((x) => x.type == PayrollComponentType.DEDUCTION && x.isEnabled && x.amount != null)
        .map((x) => x.amount);
    }

    const earning = (earningArray.filter((x) => x != null) as number[]).reduce((a, b) => a + parseInt(b.toString()), 0);
    const deduction = (deductionArray.filter((x) => x != null) as number[]).reduce(
      (a, b) => a + parseInt(b.toString()),
      0,
    );

    return {
      earning,
      deduction,
      takeHomePay: earning - deduction,
    };
  }

  payslipToTemplate(p: { payslip: Readonly<Payslip> }) {
    const { payslip } = p;

    const payrollTemplate: Partial<PayrollTemplate> = {
      employeeId: payslip.employeeId,
      employeeName: payslip.employeeName,
      positionName: payslip.positionName,
      departmentName: payslip.departmentName,
      areaName: payslip.areaName,
      payrollBaseSalary: {
        employeeId: payslip.employeeId,
        period: payslip.salaryPeriod,
        salary: payslip.salary.toString() as any,
        prorate: payslip.salaryProrate,
        prorateManualDayCount: payslip.salaryProrateManualDayCount,
      },
      payrollComponentEmployees: payslip.payslipDetails
        .filter((x) => [this.salaryComponentName, this.salaryDeductionComponentName].includes(x.name))
        .map((x) => ({
          employeeId: payslip.employeeId,
          name: x.name,
          amount: x.amount,
          notes: x.notes,
          type: x.type,
          isEnabled: true,
        })),
    };

    return payrollTemplate;
  }
}

export const PayrollService = new _PayrollService();

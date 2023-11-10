import loadable from "@loadable/component";

export const payrollConfig = [
  {
    routes: [
      {
        path: "/payroll/master",
        component: loadable(async () => await import("./payroll-master/PayrollMaster")),
      },
      {
        path: "/payroll/master/:id",
        component: loadable(async () => await import("./payroll-master/PayrollMasterDetail")),
      },
      {
        path: "/payroll/create",
        component: loadable(async () => await import("./payroll-create/PayrollCreate")),
      },
      {
        path: "/payroll/component",
        component: loadable(async () => await import("./payroll-components/PayrollComponent")),
      },
      {
        path: "/payroll/component/add",
        component: loadable(async () => await import("./payroll-components/PayrollComponentForm")),
      },
      {
        path: "/payroll/component/update/:id",
        component: loadable(async () => await import("./payroll-components/PayrollComponentForm")),
      },
      {
        path: "/payroll/template",
        component: loadable(async () => await import("./payroll-template/PayrollTemplate")),
      },
      {
        path: "/payroll/template/edit/:id",
        component: loadable(async () => await import("./payroll-template/PayrollTemplateForm")),
      },
      {
        path: "/payroll/report",
        component: loadable(async () => await import("./payroll-report/PayrollReport").then((x) => x.PayrollReport)),
      },
      {
        path: "/payroll/report/summary",
        component: loadable(
          async () => await import("./payroll-report/PayrollReportSummary").then((x) => x.PayrollReportSummary),
        ),
      },
      {
        path: "/payroll/report/by-department",
        component: loadable(
          async () =>
            await import("./payroll-report/PayrollReportByDepartment").then((x) => x.PayrollReportByDepartment),
        ),
      },
      {
        path: "/payroll/report/by-component",
        component: loadable(
          async () => await import("./payroll-report/PayrollReportByComponent").then((x) => x.PayrollReportByComponent),
        ),
      },
      {
        path: "/payroll/report/tax",
        component: loadable(
          async () => await import("./payroll-report/PayrollReportTax").then((x) => x.PayrollReportTax),
        ),
      },
      {
        path: "/payroll/ex-employee-allowance",
        component: loadable(async () => await import("./PayrollExEmployeeAllowance")),
      },
      {
        path: "/payroll/export",
        component: loadable(async () => await import("./PayrollExport")),
      },
      {
        path: "/payroll/import",
        component: loadable(async () => await import("./PayrollImport")),
      },
      {
        path: "/payroll/salary-tax-calculator",
        component: loadable(async () => await import("./PayrollSalaryTaxCalculator")),
      },
      {
        path: "/payroll/thr",
        component: loadable(async () => await import("./PayrollThr")),
      },
    ],
  },
];

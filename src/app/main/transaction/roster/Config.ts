import loadable from "@loadable/component";

export const employeeRosterReportConfig = {
  endPoint: "EmployeeRosters-List",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/transaction_report/roster_report",
      component: loadable(async () => await import("./Form")),
      exact: true,
    },
  ],
};

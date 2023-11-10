import loadable from "@loadable/component";

export const statusReportConfig = {
  endPoint: "Calculate-absent",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/transaction_report/status_report",
      component: loadable(async () => await import("./Form")),
      exact: true,
    },
  ],
};

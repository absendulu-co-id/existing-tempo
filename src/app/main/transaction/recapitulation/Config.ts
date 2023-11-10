import loadable from "@loadable/component";

export const recapitulationReportConfig = {
  endPoint: "Recapitulation-Report",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/transaction_report/recapitulation_report",
      component: loadable(async () => await import("./Form")),
      exact: true,
    },
  ],
};

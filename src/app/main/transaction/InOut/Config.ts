import loadable from "@loadable/component";

export const inOutConfig = {
  endPoint: "In-Out-Report",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/transaction_report/in_out_report",
      component: loadable(async () => await import("./Form")),
      exact: true,
    },
  ],
};

import loadable from "@loadable/component";

export const mobileLogConfig = {
  endPoint: "Attendances",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/transaction_report/mobile_log",
      component: loadable(async () => await import("./List")),
    },
  ],
};

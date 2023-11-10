import loadable from "@loadable/component";

export const transactionListConfig = {
  endPoint: "DeviceAttendance",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/transaction_report/transaction",
      component: loadable(async () => await import("./List")),
    },
  ],
};

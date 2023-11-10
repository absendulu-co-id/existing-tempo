import loadable from "@loadable/component";

export const manualLogConfig = {
  endPoint: "ManualLogs",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/approval_emp/manual_log_approval",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
  ],
};

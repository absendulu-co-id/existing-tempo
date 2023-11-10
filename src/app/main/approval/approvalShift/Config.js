import loadable from "@loadable/component";

export const approvalShiftConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/approval/approval_shift",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
  ],
};

import loadable from "@loadable/component";

export const leaveConfig = {
  endPoint: "Leaves",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/approval_emp/leave_approval",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
  ],
};

import loadable from "@loadable/component";

export const overtimeConfig = {
  endPoint: "Overtimes",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/approval_emp/overtime_approval",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
  ],
};

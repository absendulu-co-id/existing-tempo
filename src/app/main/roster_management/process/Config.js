import loadable from "@loadable/component";

export const processConfig = {
  endPoint: "EmployeeRosters",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/roster_management/process",
      component: loadable(() => import("./Form")),
      exact: true,
    },
  ],
};

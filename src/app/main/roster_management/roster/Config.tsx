import loadable from "@loadable/component";

export const rosterConfig = {
  endPoint: "EmployeeRosters",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/roster_management/roster",
      component: loadable(async () => await import("./Form")),
      exact: true,
    },
  ],
};

import loadable from "@loadable/component";

export const employeeConfig = {
  endPoint: "Employees",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/master/employees",
      component: loadable(async () => await import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/master/employees/add",
      component: loadable(async () => await import("./Form")),
    },
    {
      path: "/master/employees/edit/:id",
      component: loadable(async () => await import("./Form")),
    },
  ],
};

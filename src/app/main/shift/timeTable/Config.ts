import loadable from "@loadable/component";

export const timeTableConfig = {
  endPoint: "TimeTables",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/shifts/time_table",
      component: loadable(async () => await import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/shifts/time_table/add",
      component: loadable(async () => await import("./Form")),
    },
    {
      path: "/shifts/time_table/edit/:id",
      component: loadable(async () => await import("./Form")),
    },
  ],
};

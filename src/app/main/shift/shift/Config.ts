import loadable from "@loadable/component";

export const shiftConfig = {
  endPoint: "Shift",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/shifts/shift",
      component: loadable(async () => await import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/shifts/shift/add",
      component: loadable(async () => await import("@mid/components/form/Form")),
    },
    {
      path: "/shifts/shift/edit/:id",
      component: loadable(async () => await import("@mid/components/form/Form")),
    },
  ],
};

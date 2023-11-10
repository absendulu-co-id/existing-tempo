import loadable from "@loadable/component";

export const holidayConfig = {
  endPoint: "holiday",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/holidays/holiday",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/holidays/holiday/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/holidays/holiday/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

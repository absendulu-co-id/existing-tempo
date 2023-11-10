import loadable from "@loadable/component";

export const positionConfig = {
  endPoint: "Positions",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/master/positions",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/master/positions/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/master/positions/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

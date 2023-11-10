import loadable from "@loadable/component";

export const trainingTypeConfig = {
  endPoint: "trainingTypes",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/master/trainingTypes",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/master/trainingTypes/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/master/trainingTypes/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

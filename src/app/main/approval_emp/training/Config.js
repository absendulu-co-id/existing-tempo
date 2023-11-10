import loadable from "@loadable/component";

export const trainingConfig = {
  endPoint: "Trainings",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/approval_emp/training_approval",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
  ],
};

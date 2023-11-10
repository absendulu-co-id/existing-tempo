import loadable from "@loadable/component";
import authRole from "app/auth/authRoles";

export const trainingConfig = {
  endPoint: "Trainings",
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRole.employee,
  routes: [
    {
      path: "/request/training_request",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/request/training_request/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/request/training_request/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

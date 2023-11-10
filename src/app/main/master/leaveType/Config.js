import loadable from "@loadable/component";
import auth from "app/auth/authRoles";

export const leaveTypeConfig = {
  endPoint: "leaveTypes",
  settings: {
    layout: {
      config: {},
    },
  },
  auth: auth.mixAdmin,
  routes: [
    {
      path: "/master/leaveTypes",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/master/leaveTypes/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/master/leaveTypes/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

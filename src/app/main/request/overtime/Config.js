import loadable from "@loadable/component";
import authRole from "app/auth/authRoles";

export const overtimeConfig = {
  endPoint: "Overtimes",
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRole.employee,
  routes: [
    {
      path: "/request/overtime_request",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/request/overtime_request/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/request/overtime_request/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

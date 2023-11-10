import loadable from "@loadable/component";
import authRole from "app/auth/authRoles";

export const leaveConfig = {
  endPoint: "Leaves",
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRole.employee,
  routes: [
    {
      path: "/request/leave_request",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/request/leave_request/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/request/leave_request/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

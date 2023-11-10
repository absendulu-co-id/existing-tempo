import loadable from "@loadable/component";
import authRole from "app/auth/authRoles";

export const manualLogConfig = {
  endPoint: "ManualLogs",
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRole.employee,
  routes: [
    {
      path: "/request/manual_log_request",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/request/manual_log_request/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/request/manual_log_request/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

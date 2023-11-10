import loadable from "@loadable/component";
import authRole from "app/auth/authRoles";

export const summaryConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRole.allRoles,
  routes: [
    {
      exact: true,
      path: "/my_dashboard/summary",
      component: loadable(() => import("./Summary")),
    },
  ],
};

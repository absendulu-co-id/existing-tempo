import loadable from "@loadable/component";
import { authRoles } from "app/auth";

export const settingsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.adminOrg,
  routes: [
    {
      path: "/users_n_groups/setting",
      component: loadable(async () => (await import("./Setting")).Setting),
      exact: true,
    },
  ],
};

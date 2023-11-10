import loadable from "@loadable/component";
import auth from "app/auth/authRoles";

export const deviceListConfig = {
  endPoint: "Devices",
  settings: {
    layout: {
      config: {},
    },
  },
  auth: auth.adminOrg,
  routes: [
    {
      path: "/devices/device_list",
      component: loadable(() => import(/* webpackPrefetch: true */ "@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/devices/device_list/add",
      component: loadable(() => import(/* webpackPrefetch: true */ "@mid/components/form/Form")),
    },
    {
      path: "/devices/device_list/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

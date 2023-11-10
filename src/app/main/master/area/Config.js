import loadable from "@loadable/component";
import auth from "app/auth/authRoles";

export const areaConfig = {
  endPoint: "Area",
  settings: {
    layout: {
      config: {},
    },
  },
  auth: auth.mixAdmin,
  routes: [
    {
      path: "/master/areas",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/master/areas/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/master/areas/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

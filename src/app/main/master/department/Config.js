import loadable from "@loadable/component";
import auth from "app/auth/authRoles";

export const departmentConfig = {
  endPoint: "Department",
  settings: {
    layout: {
      config: {},
    },
  },
  auth: auth.mixAdmin,
  routes: [
    {
      path: "/master/departments",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/master/departments/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/master/departments/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

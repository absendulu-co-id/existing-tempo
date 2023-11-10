import loadable from "@loadable/component";

export const userConfig = {
  endPoint: "Users",
  settings: {
    layout: {
      config: {},
    },
  },
  // auth: authRoles.admin,
  routes: [
    {
      path: "/users_n_groups/users",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/users_n_groups/users/add",
      component: loadable(() => import("./Form")),
    },
    {
      path: "/users_n_groups/users/edit/:id",
      component: loadable(() => import("./Form")),
    },
  ],
};

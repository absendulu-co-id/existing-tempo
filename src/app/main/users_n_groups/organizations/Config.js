import loadable from "@loadable/component";

export const organizationConfig = {
  endPoint: "organizations",
  settings: {
    layout: {
      config: {},
    },
  },
  // auth: authRoles.admin,
  routes: [
    {
      path: "/users_n_groups/organizations",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/users_n_groups/organizations/add",
      component: loadable(() => import("@mid/components/form/Form")),
    },
    {
      path: "/users_n_groups/organizations/edit/:id",
      component: loadable(() => import("@mid/components/form/Form")),
    },
  ],
};

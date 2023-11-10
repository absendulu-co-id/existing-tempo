import loadable from "@loadable/component";

export const userGroupConfig = {
  endPoint: "UserGroups",
  settings: {
    layout: {
      config: {},
    },
  },
  // auth: authRoles.admin,
  routes: [
    {
      path: "/users_n_groups/user_groups",
      component: loadable(() => import("./UserGroupsList")),
      exact: true,
    },
    {
      path: "/users_n_groups/user_groups/add",
      component: loadable(() => import("./UserGroupsForm")),
    },
    {
      path: "/users_n_groups/user_groups/edit/:id",
      component: loadable(() => import("./UserGroupsForm")),
    },
  ],
};

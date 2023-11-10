import loadable from "@loadable/component";

export const workflowRoleConfig = {
  endPoint: "workflowRoles",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/workflow/workflowRole",
      component: loadable(async () => await import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/workflow/workflowRole/add",
      component: loadable(async () => await import("@mid/components/form/Form")),
    },
    {
      path: "/workflow/workflowRole/edit/:id",
      component: loadable(async () => await import("@mid/components/form/Form")),
    },
  ],
};

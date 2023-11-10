import loadable from "@loadable/component";

export const workflowBuilderConfig = {
  endPoint: "WorkflowBuilders",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/workflow/workflowBuilder",
      component: loadable(async () => await import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/workflow/workflowBuilder/add",
      component: loadable(async () => await import("./Form")),
    },
    {
      path: "/workflow/workflowBuilder/edit/:id",
      component: loadable(async () => await import("./Form")),
    },
  ],
};

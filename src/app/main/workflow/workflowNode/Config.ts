import loadable from "@loadable/component";

export const workflowNodeConfig = {
  endPoint: "workflowNode",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/workflow/workflowNode",
      component: loadable(async () => await import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/workflow/workflowNode/add",
      component: loadable(async () => await import("./Form")),
    },
    {
      path: "/workflow/workflowNode/edit/:id",
      component: loadable(async () => await import("./Form")),
    },
  ],
};

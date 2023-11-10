import loadable from "@loadable/component";

export const menuConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/approval/leave",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/approval/leave/add",
      component: loadable(() => import("./Form")),
    },
    {
      path: "/approval/leave/edit/:id",
      component: loadable(() => import("./Form")),
    },

    // overtime
    {
      path: "/approval/overtime",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/approval/overtime/add",
      component: loadable(() => import("./Form")),
    },
    {
      path: "/approval/overtime/edit/:id",
      component: loadable(() => import("./Form")),
    },

    // Training
    {
      path: "/approval/training",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/approval/training/add",
      component: loadable(() => import("./Form")),
    },
    {
      path: "/approval/training/edit/:id",
      component: loadable(() => import("./Form")),
    },

    // Manual Log
    {
      path: "/approval/manual_log",
      component: loadable(() => import("@mid/components/view/ViewMid")),
      exact: true,
    },
    {
      path: "/approval/manual_log/add",
      component: loadable(() => import("./Form")),
    },
    {
      path: "/approval/manual_log/edit/:id",
      component: loadable(() => import("./Form")),
    },
  ],
};

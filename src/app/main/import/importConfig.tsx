import loadable from "@loadable/component";

export const importConfig = [
  {
    routes: [
      {
        path: "/import",
        component: loadable(async () => (await import("./ImportList")).ImportList),
      },
      {
        path: "/import/add",
        component: loadable(async () => (await import("./ImportForm")).ImportForm),
      },
      {
        path: "/import/add/:tableName",
        component: loadable(async () => (await import("./ImportForm")).ImportForm),
      },
    ],
  },
];

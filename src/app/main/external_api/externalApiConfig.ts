import loadable from "@loadable/component";

export const externalApiConfig = [
  {
    endPoint: "DeviceAttendance",
    settings: {
      layout: {
        config: {},
      },
    },
    routes: [
      {
        path: "/external_api",
        component: loadable(async () => await import("./List")),
      },
    ],
  },
];

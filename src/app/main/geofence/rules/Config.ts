import loadable from "@loadable/component";

export const geofenceRulesConfig = {
  endPoint: "Geofence-Rules",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/geofence/rules",
      component: loadable(async () => await import("./List")),
    },
  ],
};

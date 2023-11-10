import loadable from "@loadable/component";

export const geofenceLocationConfig = {
  endPoint: "Geofence-Location",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/geofence/location",
      component: loadable(async () => await import("./List")),
    },
  ],
};

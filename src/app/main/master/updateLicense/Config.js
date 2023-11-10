import loadable from "@loadable/component";

export const updateLicenseConfig = {
  endPoint: "updateLicenses",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/master/updateLicense",
      component: loadable(() => import("./Form")),
      exact: true,
    },
  ],
};

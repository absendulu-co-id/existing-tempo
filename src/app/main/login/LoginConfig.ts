import { authRoles } from "app/auth";

export const LoginConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.guest,
  routes: [
    {
      path: "/login",
      // component: Login,
    },
    {
      path: "/forgot-password",
      exact: true,
      // component: ForgotPassword,
    },
    {
      path: "/forgot-password/:uuid",
      // component: ResetPassword,
    },
    {
      path: "/server-config",
      // component: ServerConfig,
    },
  ],
};

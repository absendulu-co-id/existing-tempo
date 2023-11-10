import { FuseUtils } from "@fuse";
import { approvalConfig } from "app/main/approval/approvalConfig";
import { approvalEmpConfig } from "app/main/approval_emp/approvalEmpConfig";
import { devicesConfig } from "app/main/devices/devicesConfig";
import { externalApiConfig } from "app/main/external_api/externalApiConfig";
import { geofenceConfig } from "app/main/geofence/geofenceConfig";
import { holidaysConfig } from "app/main/holidays/holidaysConfig";
import { importConfig } from "app/main/import/importConfig";
import { LoginConfig } from "app/main/login/LoginConfig";
import { masterConfig } from "app/main/master/masterConfig";
import { myDashboardConfig } from "app/main/my-dashboard/myDashboardConfig";
import { pagesConfigs } from "app/main/pages/pagesConfigs";
import { payrollConfig } from "app/main/payroll/payrollConfig";
import { requestConfig } from "app/main/request/requestConfig";
import { rosterManagementConfig } from "app/main/roster_management/rosterManagementConfig";
import { shiftConfigs } from "app/main/shift/shiftConfig";
import { transactionConfig } from "app/main/transaction/transactionConfig";
import { usersNGroupsConfig } from "app/main/users_n_groups/usersNGroupsConfig";
import { workflowConfig } from "app/main/workflow/workflowConfig";
import { Redirect } from "react-router-dom";

const routeConfigs = [
  LoginConfig,
  ...myDashboardConfig,
  ...usersNGroupsConfig,
  ...masterConfig,
  ...devicesConfig,
  ...approvalConfig,
  ...approvalEmpConfig,
  ...requestConfig,
  ...holidaysConfig,
  ...shiftConfigs,
  ...rosterManagementConfig,
  ...workflowConfig,
  ...transactionConfig,
  ...pagesConfigs,
  ...externalApiConfig,
  ...geofenceConfig,
  ...payrollConfig,
  ...importConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/my_dashboard/summary" />,
  },
  {
    component: () => <Redirect to="/pages/errors/error-404" />,
  },
];

export default routes;

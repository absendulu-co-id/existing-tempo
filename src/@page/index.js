import { approvalLeavePage } from "./approval/approval-leave.page";
import { approvalManualLogPage } from "./approval/approval-manualLog.page";
import { approvalovertimePage } from "./approval/approval-overtime.page";
import { approvaltrainingPage } from "./approval/approval-training.page";
import { approvalShiftPage } from "./approvalShift.page";
import { devicePage } from "./device.page";
import { holidayPage } from "./holiday.page";
import { leavePage } from "./leave.page";
import { manualLogPage } from "./manualLog.page";
import { masterPage } from "./master";
import { organizationPage } from "./organization.page";
import { overtimePage } from "./overtime.page";
import { requestPage } from "./request";
import { shiftPages } from "./shift";
import { trainingPage } from "./training.page";
import { userPage } from "./user.page";
import { workflowPage } from "./workflow";

export const data = {
  ...masterPage,
  ...devicePage,
  ...leavePage,
  ...overtimePage,
  ...trainingPage,
  ...manualLogPage,
  ...holidayPage,
  ...workflowPage,
  ...requestPage,
  ...approvalLeavePage,
  ...approvalManualLogPage,
  ...approvalovertimePage,
  ...approvaltrainingPage,
  ...organizationPage,
  ...userPage,
  ...approvalShiftPage,
  ...shiftPages,
};

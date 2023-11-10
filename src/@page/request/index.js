import { requestLeavePage } from "./request-leave.page";
import { requestManualLogPage } from "./request-manual-log.page";
import { requestOvertimePage } from "./request-overtime.page";
import { requestTrainingPage } from "./request-training.page";

export const requestPage = {
  ...requestLeavePage,
  ...requestManualLogPage,
  ...requestTrainingPage,
  ...requestOvertimePage,
};

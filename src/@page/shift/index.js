import { shiftPage } from "./shift.page";
import { timeTablePage } from "./timeTable.page";

export const shiftPages = {
  ...timeTablePage,
  ...shiftPage,
};

import { areaPage } from "./area.page";
import { departmentPage } from "./department.page";
import { employeePage } from "./employee.page";
import { leaveTypePage } from "./leaveType.page";
import { positionPage } from "./position.page";
import { trainingTypePage } from "./trainingType.page";

export const masterPage = {
  ...areaPage,
  ...positionPage,
  ...departmentPage,
  ...leaveTypePage,
  ...trainingTypePage,
  ...employeePage,
};

import { workflowBuilderPage } from "./workflowBuilder.page";
import { workflowNodePage } from "./workflowNode.page";
import { workflowRolePage } from "./workflowRole.page";

export const workflowPage = {
  ...workflowRolePage,
  ...workflowBuilderPage,
  ...workflowNodePage,
};

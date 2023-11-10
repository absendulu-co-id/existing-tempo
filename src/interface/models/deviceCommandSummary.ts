export interface DeviceCommandSummary {
  totalCommand: number;
  totalCommandUnexecuted: number;
  totalCommandExecuted: number;
  totalCommandFailed: number;
  lastCommandExecuted: Date;
}

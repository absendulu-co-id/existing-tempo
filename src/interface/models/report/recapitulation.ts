export interface ReportRecapitulation {
  employeeId: string;
  employeeName: string;
  departmentId?: number;
  departmentName?: string;
  employeerosterCount: number;
  workingDay: number;
  attendanceWorkingDay: number;
  absent: number;
  nonWorkingDay: number;
  leave: number;
  nonAttendanceWorkingDay: number;
  checkInEarly: string;
  checkInLate: string;
  checkOutEarly: string;
  checkOutLate: string;
}

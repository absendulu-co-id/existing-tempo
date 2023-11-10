import loadable from "@loadable/component";

export const attendanceReportConfig = {
  endPoint: "Attendance-Summary",
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/transaction_report/attendance_report",
      component: loadable(async () => await import(/* webpackPrefetch: true */ "./List")),
    },
  ],
};

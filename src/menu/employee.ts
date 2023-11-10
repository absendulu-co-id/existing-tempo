import { NavigationState } from "app/store/reducers/fuse/navigation.reducer";

export const employeeMenu: NavigationState[] = [
  {
    id: "main-navigation",
    title: "Menu Utama",
    type: "group",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "collapse",
        icon: "dashboard",
        children: [
          {
            id: "summary_dashboard",
            title: "Ringkasan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/my_dashboard/summary",
          },
        ],
      },
      {
        id: "request",
        title: "Permintaan",
        type: "collapse",
        icon: "list_alt",
        children: [
          {
            id: "leave_request",
            title: "Cuti",
            type: "item",
            icon: "fiber_manual_record",
            url: "/request/leave_request",
            access: [
              { id: "leave_request_add", title: "Tambah" },
              { id: "leave_request_edit", title: "Ubah" },
              { id: "leave_request_delete", title: "Hapus" },
            ],
          },
          {
            id: "training_request",
            title: "Pelatihan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/request/training_request",
            access: [
              { id: "training_request_add", title: "Tambah" },
              { id: "training_request_edit", title: "Ubah" },
              { id: "training_request_delete", title: "Hapus" },
            ],
          },
          {
            id: "overtime_request",
            title: "Lembur",
            type: "item",
            icon: "fiber_manual_record",
            url: "/request/overtime_request",
            access: [
              { id: "overtime_request_add", title: "Tambah" },
              { id: "overtime_request_edit", title: "Ubah" },
              { id: "overtime_request_delete", title: "Hapus" },
            ],
          },
          {
            id: "manual_log_request",
            title: "Catatan Manual",
            type: "item",
            icon: "fiber_manual_record",
            url: "/request/manual_log_request",
            access: [
              { id: "manual_log_request_add", title: "Tambah" },
              { id: "manual_log_request_edit", title: "Ubah" },
              { id: "manual_log_request_delete", title: "Hapus" },
            ],
          },
        ],
      },
      {
        id: "approval_emp",
        title: "Persetujuan",
        type: "collapse",
        icon: "fact_check",
        children: [
          {
            id: "leave_approval",
            title: "Cuti",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval_emp/leave_approval",
            access: [{ id: "leave_approval_edit", title: "Ubah" }],
          },
          {
            id: "training_approval",
            title: "Pelatihan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval_emp/training_approval",
            access: [{ id: "training_approval_edit", title: "Ubah" }],
          },
          {
            id: "overtime_approval",
            title: "Lembur",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval_emp/overtime_approval",
            access: [{ id: "overtime_approval_edit", title: "Ubah" }],
          },
          {
            id: "manual_log_approval",
            title: "Catatan Manual",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval_emp/manual_log_approval",
            access: [{ id: "manual_log_approval_edit", title: "Ubah" }],
          },
        ],
      },
      {
        id: "transaction_report",
        title: "Laporan Transaksi",
        type: "collapse",
        icon: "list",
        children: [
          {
            id: "attendance_report",
            title: "Kehadiran",
            type: "item",
            icon: "fiber_manual_record",
            url: "/transaction_report/attendance_report",
          },
          {
            id: "roster_report",
            title: "Roster",
            type: "item",
            icon: "fiber_manual_record",
            url: "/transaction_report/roster_report",
          },
        ],
      },
    ],
  },
];

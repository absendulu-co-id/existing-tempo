import { authRoles } from "app/auth";

export const FieldData = [
  {
    value: "",
    type: "text",
    name: "userGroupName",
    label: "Kelompok Pengguna",
    placeholder: "",
    search: true,
    multiline: false,
    rows: 0,
    rowsMax: 0,
    validations: "isExisty",
    validationErrors: {
      isExisty: "Field Harus diisi dan hanya boleh berupa kalimat",
    },
  },
];

export const Menu = (data) => [
  {
    id: "main-navigation",
    status: true,
    title: "Menu Utama",
    type: "group",
    children: [
      {
        id: "my_dashboard",
        status: data === undefined ? false : data.dashboard,
        title: "Dashboard",
        type: "collapse",
        icon: "dashboard",
        children: [
          {
            id: "summary_dashboard",
            status: data === undefined ? false : data.summary_dashboard,
            title: "Ringkasan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/my_dashboard/summary",
          },
        ],
      },
      {
        auth: authRoles.admin,
        id: "users_n_groups",
        status: data === undefined ? false : data.users_n_groups,
        title: "Users & Groups",
        type: "collapse",
        icon: "vpn_key",
        children: [
          {
            auth: authRoles.admin,
            id: "user_groups",
            status: data === undefined ? false : data.user_groups,
            title: "Kelompok Pengguna",
            type: "item",
            icon: "fiber_manual_record",
            url: "/users_n_groups/user_groups",
            access: [
              {
                id: "user_groups_add",
                status: data === undefined ? false : data.user_groups_add,
                title: "Tambah",
              },
              {
                id: "user_groups_edit",
                status: data === undefined ? false : data.user_groups_edit,
                title: "Ubah",
              },
              {
                id: "user_groups_delete",
                status: data === undefined ? false : data.user_groups_delete,
                title: "Hapus",
              },
            ],
          },
          {
            auth: authRoles.admin,
            id: "users",
            status: data === undefined ? false : data.users,
            title: "Pengguna",
            type: "item",
            icon: "fiber_manual_record",
            url: "/users_n_groups/users",
            access: [
              {
                id: "users_add",
                status: data === undefined ? false : data.users_add,
                title: "Tambah",
              },
              {
                id: "users_edit",
                status: data === undefined ? false : data.users_edit,
                title: "Ubah",
              },
              {
                id: "users_delete",
                status: data === undefined ? false : data.users_delete,
                title: "Hapus",
              },
            ],
          },
        ],
      },
      {
        id: "master",
        status: data === undefined ? false : data.master,
        title: "Master",
        type: "collapse",
        icon: "settings",
        children: [
          {
            id: "areas",
            status: data === undefined ? false : data.areas,
            title: "Area",
            type: "item",
            icon: "fiber_manual_record",
            url: "/master/areas",
            access: [
              {
                id: "areas_add",
                status: data === undefined ? false : data.areas_add,
                title: "Tambah",
              },
              {
                id: "areas_edit",
                status: data === undefined ? false : data.areas_edit,
                title: "Ubah",
              },
              {
                id: "areas_delete",
                status: data === undefined ? false : data.areas_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "departments",
            status: data === undefined ? false : data.departments,
            title: "Departemen",
            type: "item",
            icon: "fiber_manual_record",
            url: "/master/departments",
            access: [
              {
                id: "departments_add",
                status: data === undefined ? false : data.departments_add,
                title: "Tambah",
              },
              {
                id: "departments_edit",
                status: data === undefined ? false : data.departments_edit,
                title: "Ubah",
              },
              {
                id: "departments_delete",
                status: data === undefined ? false : data.departments_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "positions",
            status: data === undefined ? false : data.positions,
            title: "Jabatan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/master/positions",
            access: [
              {
                id: "positions_add",
                status: data === undefined ? false : data.positions_add,
                title: "Tambah",
              },
              {
                id: "positions_edit",
                status: data === undefined ? false : data.positions_edit,
                title: "Ubah",
              },
              {
                id: "positions_delete",
                status: data === undefined ? false : data.positions_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "leaveTypes",
            status: data === undefined ? false : data.leaveTypes,
            title: "Jenis Cuti",
            type: "item",
            icon: "fiber_manual_record",
            url: "/master/leaveTypes",
            access: [
              {
                id: "leaveTypes_add",
                status: data === undefined ? false : data.leaveTypes_add,
                title: "Tambah",
              },
              {
                id: "leaveTypes_edit",
                status: data === undefined ? false : data.leaveTypes_edit,
                title: "Ubah",
              },
              {
                id: "leaveTypes_delete",
                status: data === undefined ? false : data.leaveTypes_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "trainingTypes",
            status: data === undefined ? false : data.trainingTypes,
            title: "Jenis Latihan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/master/trainingTypes",
            access: [
              {
                id: "trainingTypes_add",
                status: data === undefined ? false : data.trainingTypes_add,
                title: "Tambah",
              },
              {
                id: "trainingTypes_edit",
                status: data === undefined ? false : data.trainingTypes_edit,
                title: "Ubah",
              },
              {
                id: "trainingTypes_delete",
                status: data === undefined ? false : data.trainingTypes_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "employees",
            status: data === undefined ? false : data.employees,
            title: "Karyawan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/master/employees",
            access: [
              {
                id: "employees_add",
                status: data === undefined ? false : data.employees_add,
                title: "Tambah",
              },
              {
                id: "employees_edit",
                status: data === undefined ? false : data.employees_edit,
                title: "Ubah",
              },
              {
                id: "employees_delete",
                status: data === undefined ? false : data.employees_delete,
                title: "Hapus",
              },
            ],
          },
          {
            auth: authRoles.admin,
            id: "organizations",
            status: data === undefined ? false : data.organizations,
            title: "Perusahaan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/master/organizations",
            access: [
              {
                id: "organizations_add",
                status: data === undefined ? false : data.organizations_add,
                title: "Tambah",
              },
              {
                id: "organizations_edit",
                status: data === undefined ? false : data.organizations_edit,
                title: "Ubah",
              },
              {
                id: "organizations_delete",
                status: data === undefined ? false : data.organizations_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "updateLicense",
            status: data === undefined ? false : data.updateLicense,
            title: "Update License",
            type: "item",
            icon: "fiber_manual_record",
            url: "/master/updateLicense",
            access: [
              {
                id: "updateLicense_add",
                status: data === undefined ? false : data.updateLicense_add,
                title: "Tambah",
              },
            ],
          },
        ],
      },
      {
        id: "devices",
        status: data === undefined ? false : data.devices,
        title: "Perangkat",
        type: "collapse",
        icon: "devices",
        children: [
          {
            id: "device_list",
            status: data === undefined ? false : data.device_list,
            title: "Perangkat",
            type: "item",
            icon: "fiber_manual_record",
            url: "/devices/device_list",
            access: [
              {
                id: "device_list_add",
                status: data === undefined ? false : data.device_list_add,
                title: "Tambah",
              },
              {
                id: "device_list_edit",
                status: data === undefined ? false : data.device_list_edit,
                title: "Ubah",
              },
              {
                id: "device_list_delete",
                status: data === undefined ? false : data.device_list_delete,
                title: "Hapus",
              },
            ],
          },
        ],
      },
      {
        id: "approval",
        status: data === undefined ? false : data.approval,
        title: "Persetujuan",
        type: "collapse",
        icon: "fact_check",
        children: [
          {
            id: "leave",
            status: data === undefined ? false : data.leave,
            title: "Cuti",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval/leave",
            access: [
              {
                id: "leave_add",
                status: data === undefined ? false : data.leave_add,
                title: "Tambah",
              },
              {
                id: "leave_edit",
                status: data === undefined ? false : data.leave_edit,
                title: "Ubah",
              },
              {
                id: "leave_delete",
                status: data === undefined ? false : data.leave_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "training",
            status: data === undefined ? false : data.training,
            title: "Pelatihan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval/training",
            access: [
              {
                id: "training_add",
                status: data === undefined ? false : data.training_add,
                title: "Tambah",
              },
              {
                id: "training_edit",
                status: data === undefined ? false : data.training_edit,
                title: "Ubah",
              },
              {
                id: "training_delete",
                status: data === undefined ? false : data.training_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "overtime",
            status: data === undefined ? false : data.overtime,
            title: "Lembur",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval/overtime",
            access: [
              {
                id: "overtime_add",
                status: data === undefined ? false : data.overtime_add,
                title: "Tambah",
              },
              {
                id: "overtime_edit",
                status: data === undefined ? false : data.overtime_edit,
                title: "Ubah",
              },
              {
                id: "overtime_delete",
                status: data === undefined ? false : data.overtime_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "manual_log",
            status: data === undefined ? false : data.manual_log,
            title: "Catatan Manual",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval/manual_log",
            access: [
              {
                id: "manual_log_add",
                status: data === undefined ? false : data.manual_log_add,
                title: "Tambah",
              },
              {
                id: "manual_log_edit",
                status: data === undefined ? false : data.manual_log_edit,
                title: "Ubah",
              },
              {
                id: "manual_log_delete",
                status: data === undefined ? false : data.manual_log_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "approval_shift",
            status: data === undefined ? false : data.approval_shift,
            title: "Catatan Manual",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval/approval_shift",
            access: [
              {
                id: "approval_shift_add",
                status: data === undefined ? false : data.approval_shift_add,
                title: "Tambah",
              },
              {
                id: "approval_shift_edit",
                status: data === undefined ? false : data.approval_shift_edit,
                title: "Ubah",
              },
              {
                id: "approval_shift_delete",
                status: data === undefined ? false : data.approval_shift_delete,
                title: "Hapus",
              },
            ],
          },
        ],
      },
      {
        id: "request",
        status: data === undefined ? false : data.request,
        title: "Permintaan",
        type: "collapse",
        icon: "list_alt",
        children: [
          {
            id: "leave_request",
            status: data === undefined ? false : data.leave_request,
            title: "Cuti",
            type: "item",
            icon: "fiber_manual_record",
            url: "/request/leave_request",
            access: [
              {
                id: "leave_request_add",
                status: data === undefined ? false : data.leave_request_add,
                title: "Tambah",
              },
              {
                id: "leave_request_edit",
                status: data === undefined ? false : data.leave_request_edit,
                title: "Ubah",
              },
              {
                id: "leave_request_delete",
                status: data === undefined ? false : data.leave_request_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "training_request",
            status: data === undefined ? false : data.training_request,
            title: "Pelatihan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/request/training_request",
            access: [
              {
                id: "training_request_add",
                status: data === undefined ? false : data.training_request_add,
                title: "Tambah",
              },
              {
                id: "training_request_edit",
                status: data === undefined ? false : data.training_request_edit,
                title: "Ubah",
              },
              {
                id: "training_request_delete",
                status: data === undefined ? false : data.training_request_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "overtime_request",
            status: data === undefined ? false : data.overtime_request,
            title: "Lembur",
            type: "item",
            icon: "fiber_manual_record",
            url: "/request/overtime_request",
            access: [
              {
                id: "overtime_request_add",
                status: data === undefined ? false : data.overtime_request_add,
                title: "Tambah",
              },
              {
                id: "overtime_request_edit",
                status: data === undefined ? false : data.overtime_request_edit,
                title: "Ubah",
              },
              {
                id: "overtime_request_delete",
                status: data === undefined ? false : data.overtime_request_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "manual_log_request",
            status: data === undefined ? false : data.manual_log_request,
            title: "Catatan Manual",
            type: "item",
            icon: "fiber_manual_record",
            url: "/request/manual_log_request",
            access: [
              {
                id: "manual_log_request_add",
                status: data === undefined ? false : data.manual_log_request_add,
                title: "Tambah",
              },
              {
                id: "manual_log_request_edit",
                status: data === undefined ? false : data.manual_log_request_edit,
                title: "Ubah",
              },
              {
                id: "manual_log_request_delete",
                status: data === undefined ? false : data.manual_log_request_delete,
                title: "Hapus",
              },
            ],
          },
        ],
      },
      {
        id: "approval_emp",
        status: data === undefined ? false : data.approval_emp,
        title: "Persetujuan",
        type: "collapse",
        icon: "fact_check",
        children: [
          {
            id: "leave_approval",
            status: data === undefined ? false : data.leave_approval,
            title: "Cuti",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval_emp/leave_approval",
            access: [
              {
                id: "leave_approval_add",
                status: data === undefined ? false : data.leave_approval_add,
                title: "Tambah",
              },
              {
                id: "leave_approval_edit",
                status: data === undefined ? false : data.leave_approval_edit,
                title: "Ubah",
              },
              {
                id: "leave_approval_delete",
                status: data === undefined ? false : data.leave_approval_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "training_approval",
            status: data === undefined ? false : data.training_approval,
            title: "Pelatihan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval_emp/training_approval",
            access: [
              {
                id: "training_approval_add",
                status: data === undefined ? false : data.training_approval_add,
                title: "Tambah",
              },
              {
                id: "training_approval_edit",
                status: data === undefined ? false : data.training_approval_edit,
                title: "Ubah",
              },
              {
                id: "training_approval_delete",
                status: data === undefined ? false : data.training_approval_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "overtime_approval",
            status: data === undefined ? false : data.overtime_approval,
            title: "Lembur",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval_emp/overtime_approval",
            access: [
              {
                id: "overtime_approval_add",
                status: data === undefined ? false : data.overtime_approval_add,
                title: "Tambah",
              },
              {
                id: "overtime_approval_edit",
                status: data === undefined ? false : data.overtime_approval_edit,
                title: "Ubah",
              },
              {
                id: "overtime_approval_delete",
                status: data === undefined ? false : data.overtime_approval_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "manual_log_approval",
            status: data === undefined ? false : data.manual_log_approval,
            title: "Catatan Manual",
            type: "item",
            icon: "fiber_manual_record",
            url: "/approval_emp/manual_log_approval",
            access: [
              {
                id: "manual_log_approval_add",
                status: data === undefined ? false : data.manual_log_approval_add,
                title: "Tambah",
              },
              {
                id: "manual_log_approval_edit",
                status: data === undefined ? false : data.manual_log_approval_edit,
                title: "Ubah",
              },
              {
                id: "manual_log_approval_delete",
                status: data === undefined ? false : data.manual_log_approval_delete,
                title: "Hapus",
              },
            ],
          },
        ],
      },
      {
        id: "holidays",
        status: data === undefined ? false : data.holidays,
        title: "Libur",
        type: "collapse",
        icon: "add_box",
        children: [
          {
            id: "holiday",
            status: data === undefined ? false : data.holiday,
            title: "Libur",
            type: "item",
            icon: "fiber_manual_record",
            url: "/holidays/holiday",
            access: [
              {
                id: "holiday_add",
                status: data === undefined ? false : data.holiday_add,
                title: "Tambah",
              },
              {
                id: "holiday_edit",
                status: data === undefined ? false : data.holiday_edit,
                title: "Ubah",
              },
              {
                id: "holiday_delete",
                status: data === undefined ? false : data.holiday_delete,
                title: "Hapus",
              },
            ],
          },
        ],
      },
      {
        id: "shifts",
        status: data === undefined ? false : data.shifts,
        title: "Shift",
        type: "collapse",
        icon: "calendar_today",
        children: [
          {
            id: "time_table",
            status: data === undefined ? false : data.time_table,
            title: "Jadwal",
            type: "item",
            icon: "fiber_manual_record",
            url: "/shifts/time_table",
            access: [
              {
                id: "time_table_add",
                status: data === undefined ? false : data.time_table_add,
                title: "Tambah",
              },
              {
                id: "time_table_edit",
                status: data === undefined ? false : data.time_table_edit,
                title: "Ubah",
              },
              {
                id: "time_table_delete",
                status: data === undefined ? false : data.time_table_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "shift",
            status: data === undefined ? false : data.shift,
            title: "Shift",
            type: "item",
            icon: "fiber_manual_record",
            url: "/shifts/shift",
            access: [
              {
                id: "shift_add",
                status: data === undefined ? false : data.shift_add,
                title: "Tambah",
              },
              {
                id: "shift_edit",
                status: data === undefined ? false : data.shift_edit,
                title: "Ubah",
              },
              {
                id: "shift_delete",
                status: data === undefined ? false : data.shift_delete,
                title: "Hapus",
              },
            ],
          },
        ],
      },
      {
        id: "roster_management",
        status: data === undefined ? false : data.roster_management,
        title: "Roster Management",
        type: "collapse",
        icon: "schedule",
        children: [
          {
            id: "roster",
            status: data === undefined ? false : data.roster,
            title: "Roster",
            type: "item",
            icon: "fiber_manual_record",
            url: "/roster_management/roster",
            access: [
              {
                id: "roster_add",
                status: data === undefined ? false : data.roster_add,
                title: "Tambah",
              },
              {
                id: "roster_edit",
                status: data === undefined ? false : data.roster_edit,
                title: "Ubah",
              },
              {
                id: "roster_delete",
                status: data === undefined ? false : data.roster_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "process",
            status: data === undefined ? false : data.process,
            title: "Process",
            type: "item",
            icon: "fiber_manual_record",
            url: "/roster_management/process",
            access: [
              {
                id: "process_add",
                status: data === undefined ? false : data.process_add,
                title: "Tambah",
              },
              {
                id: "process_edit",
                status: data === undefined ? false : data.process_edit,
                title: "Ubah",
              },
              {
                id: "process_delete",
                status: data === undefined ? false : data.process_delete,
                title: "Hapus",
              },
            ],
          },
        ],
      },
      {
        id: "workflow",
        status: data === undefined ? false : data.workflow,
        title: "Workflow",
        type: "collapse",
        icon: "list",
        children: [
          {
            id: "workflowRole",
            status: data === undefined ? false : data.workflowRole,
            title: "Workflow Role",
            type: "item",
            icon: "fiber_manual_record",
            url: "/workflow/workflowRole",
            access: [
              {
                id: "workflowRole_add",
                status: data === undefined ? false : data.workflowRole_add,
                title: "Tambah",
              },
              {
                id: "workflowRole_edit",
                status: data === undefined ? false : data.workflowRole_edit,
                title: "Ubah",
              },
              {
                id: "workflowRole_delete",
                status: data === undefined ? false : data.workflowRole_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "workflowBuilder",
            status: data === undefined ? false : data.workflowBuilder,
            title: "Workflow Builder",
            type: "item",
            icon: "fiber_manual_record",
            url: "/workflow/workflowBuilder",
            access: [
              {
                id: "workflowBuilder_add",
                status: data === undefined ? false : data.workflowBuilder_add,
                title: "Tambah",
              },
              {
                id: "workflowBuilder_edit",
                status: data === undefined ? false : data.workflowBuilder_edit,
                title: "Ubah",
              },
              {
                id: "workflowBuilder_delete",
                status: data === undefined ? false : data.workflowBuilder_delete,
                title: "Hapus",
              },
            ],
          },
          {
            id: "workflowNode",
            status: data === undefined ? false : data.workflowNode,
            title: "Workflow Node",
            type: "item",
            icon: "fiber_manual_record",
            url: "/workflow/workflowNode",
            access: [
              {
                id: "workflowNode_edit",
                status: data === undefined ? false : data.workflowNode_edit,
                title: "Ubah",
              },
            ],
          },
        ],
      },
      {
        id: "transaction_report",
        status: data === undefined ? false : data.transaction_report,
        title: "Laporan Transaksi",
        type: "collapse",
        icon: "list",
        children: [
          {
            id: "transaction",
            status: data === undefined ? false : data.transaction,
            title: "Transaksi",
            type: "item",
            icon: "fiber_manual_record",
            url: "/transaction_report/transaction",
          },
          {
            id: "attendance_report",
            status: data === undefined ? false : data.attendance_report,
            title: "Kehadiran",
            type: "item",
            icon: "fiber_manual_record",
            url: "/transaction_report/attendance_report",
          },
          {
            id: "mobile_log",
            status: data === undefined ? false : data.mobile_log,
            title: "Mobile Log",
            type: "item",
            icon: "fiber_manual_record",
            url: "/transaction_report/mobile_log",
          },
          {
            id: "recapitulation_report",
            status: data === undefined ? false : data.recapitulation_report,
            title: "Rekapitulasi",
            type: "item",
            icon: "fiber_manual_record",
            url: "/transaction_report/recapitulation_report",
          },
          {
            id: "in_out_report",
            status: data === undefined ? false : data.in_out_report,
            title: "In Out",
            type: "item",
            icon: "fiber_manual_record",
            url: "/transaction_report/in_out_report",
          },
          {
            id: "status_report",
            status: data === undefined ? false : data.status_report,
            title: "Status",
            type: "item",
            icon: "fiber_manual_record",
            url: "/transaction_report/status_report",
          },
          {
            id: "roster_report",
            status: data === undefined ? false : data.roster_report,
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

export const OtherAccess = [
  {
    id: "closeBatch",
    label: "Tutup Kasir",
  },
  {
    id: "stopTransaction",
    label: "Tutup Toko",
  },
  {
    id: "void",
    label: "Void Transaksi",
  },
];

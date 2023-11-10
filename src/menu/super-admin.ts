import { NavigationState } from "app/store/reducers/fuse/navigation.reducer";

export const superAdminMenu: NavigationState[] = [
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
        auth: ["admin"],
        id: "users_n_groups",
        title: "Users & Groups",
        type: "collapse",
        icon: "vpn_key",
        children: [
          {
            auth: ["admin"],
            id: "users",
            title: "Pengguna",
            type: "item",
            icon: "fiber_manual_record",
            url: "/users_n_groups/users",
            access: [
              { id: "users_add", title: "Tambah" },
              { id: "users_edit", title: "Ubah" },
              { id: "users_delete", title: "Hapus" },
            ],
          },
          {
            auth: ["admin", "adminOrg"],
            id: "organizations",
            title: "Perusahaan",
            type: "item",
            icon: "fiber_manual_record",
            url: "/users_n_groups/organizations",
            access: [
              { id: "organizations_add", title: "Tambah" },
              { id: "organizations_edit", title: "Ubah" },
              { id: "organizations_delete", title: "Hapus" },
            ],
          },
        ],
      },
    ],
  },
];

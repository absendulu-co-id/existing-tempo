const authRoles = {
  admin: ["admin"],
  adminOrg: ["adminOrg"],
  mixAdmin: ["admin", "adminOrg"],
  employee: ["employee"],
  organization: ["adminOrg", "employee"],
  allRoles: ["admin", "adminOrg", "employee"],
  guest: [],
};

export default authRoles;

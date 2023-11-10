export const getAccess = (access, pathname) => {
  if (!access) {
    return false;
  }
  const accessReturn = {
    addRule: false,
    editRule: false,
    deleteRule: false,
  };
  const pathUrl = pathname.split("/");

  if (pathUrl.length >= 3) {
    const parentMenu = access.find((obj) => {
      return obj.id === pathUrl[1];
    })?.children;
    const accessMenu = parentMenu?.find((obj) => {
      return obj.url === `/${pathUrl[1]}/${pathUrl[2]}`;
    })?.access;

    if (accessMenu) {
      accessReturn.addRule = accessMenu.some((data) => data.id === `${pathUrl[2]}_add`);
      accessReturn.editRule = accessMenu.some((data) => data.id === `${pathUrl[2]}_edit`);
      accessReturn.deleteRule = accessMenu.some((data) => data.id === `${pathUrl[2]}_delete`);
    } else {
      const parent = access.find((obj) => obj.id === pathUrl[2])?.access;
      if (parent != null) {
        accessReturn.addRule = parent.some((data) => data.id === `${pathUrl[2]}_add`);
        accessReturn.editRule = parent.some((data) => data.id === `${pathUrl[2]}_edit`);
        accessReturn.deleteRule = parent.some((data) => data.id === `${pathUrl[2]}_delete`);
      }
    }
  }
  return accessReturn;
};

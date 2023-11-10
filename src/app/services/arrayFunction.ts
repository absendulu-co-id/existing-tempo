export const converArrayToString = (array: any, fieldName: string) => {
  let stringResult = "";
  const checkArray = typeof array === "string" ? JSON.parse(array) : array;
  const checkArray2 = typeof checkArray === "string" ? JSON.parse(checkArray) : checkArray;
  if (checkArray2) {
    checkArray2.map((item, index) => {
      return (stringResult = index === 0 ? item[fieldName] : stringResult + ", " + item[fieldName]);
    });
  }

  return stringResult;
};

export const findNavigationAccess = (navData) => {
  let x = "|";
  const access = {
    allowAdd: false,
    allowEdit: false,
    allowDelete: false,
    allowExport: false,
  };
  navData.children.forEach((value) => {
    x += value.id + "|";
    value.children.forEach((value2) => {
      x += value2.url + "|";
      if (value2.access !== undefined) {
        value2.access.forEach((value3) => {
          x += value2.url + "-" + value3.id + "|";
        });
      }
    });
  });
  const navigationDecode = x;
  const pathArray = window.location.pathname.split("/");
  const dMenu = "/" + pathArray[1] + "/" + pathArray[2] + "-" + pathArray[2];

  if (dMenu !== "dashboard") {
    if (navigationDecode.includes("|" + dMenu + "_add|")) {
      access.allowAdd = true;
    }
    if (navigationDecode.includes("|" + dMenu + "_edit|")) {
      access.allowEdit = true;
    }
    if (navigationDecode.includes("|" + dMenu + "_delete|")) {
      access.allowDelete = true;
    }
    if (navigationDecode.includes("|" + dMenu + "_export|")) {
      if (access.allowExport !== undefined) {
        access.allowExport = true;
      }
    }
  }
  return access;
};

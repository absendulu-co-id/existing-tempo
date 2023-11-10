import axios from "axios";

const curModule = "model-helper-debug";
export const uploadDataUser = async (rowData) => {
  return await axios.post("/device-upload-user", [rowData]);
};

export const selectData = async (params) => {
  if (params !== undefined) {
    if (params.endPoint !== undefined) {
      let url = "/" + params.endPoint + "?";
      if (params.where !== undefined && params.where.length > 0) {
        params.where.forEach((rowWhere) => {
          if (rowWhere.fixValue) {
            url += `&filter[where][${rowWhere.columnName}]=${rowWhere.columnValue}`;
          } else {
            url += `&filter[where][${rowWhere.columnName}][like]=${rowWhere.columnValue}`;
          }
        });
      }
      if (params.order !== undefined) {
        url += `&filter[order]=${params.order}%20`;
        if (params.direction == undefined) {
          url += "asc";
        } else {
          url += params.direction;
        }
      }
      if (params.limit !== undefined && params.skip !== undefined) {
        url += `&filter[limit]=${params.limit}&filter[skip]=${params.skip}`;
      }
      const res = await axios.get(url);

      if (res.status === 200) {
        // console.info(curModule, res.data);
        return res.data;
      } else {
        // TODO SHOULD BE ERROR
        return "get Data gagal";
      }
    } else {
      throw new Error("endPoint tidak ada");
    }
  } else {
    throw new Error("Param tidak ada");
  }
};

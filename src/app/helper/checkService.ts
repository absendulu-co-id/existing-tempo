import axios from "axios";
import swal from "sweetalert";

export const checkFirst = async () => {
  const serverUrl = localStorage.getItem("serverUrl");
  if (!serverUrl || serverUrl === null) {
    localStorage.clear();
    throw Error("Tidak dapat terhubung dengan API, silahkan cek koneksi internet Anda");
  }

  const res = await axios.get(serverUrl).catch((err) => {
    localStorage.clear();
    throw err;
  });

  if (res.status == 200) {
    axios.defaults.baseURL = serverUrl + "/api";
    return true;
  }
};

export const checkService = async () => {
  const serverUrl = localStorage.getItem("serverUrl");
  if (!serverUrl || serverUrl === null) {
    localStorage.clear();
    return "not_configured";
  }

  try {
    const res = await axios.get(serverUrl);
    if (res.status == 200) {
      axios.defaults.baseURL = serverUrl + "/api";
    }
  } catch (error) {
    await swal("Gagal!", "Tidak dapat terhubung dengan API, silahkan cek koneksi internet Anda", "error");
  }
};

import { setupInterceptors } from "./interceptor";
import * as Sentry from "@sentry/react";
import { EventEmitter } from "@fuse/FuseUtils";
import { checkFirst } from "app/helper/checkService";
import axios from "axios";
import jwtDecode from "jwt-decode";

class JwtService extends EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    setupInterceptors(axios, () => {
      // if you ever get an unauthorized response, logout the user
      this.emit("onAutoLogout", "Invalid access_token");
      this.setSession(null);
    });
  };

  handleAuthentication = () => {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(accessToken)) {
      this.setSession(accessToken);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "accessToken expired");
    }
  };

  createUser = async (data) => {
    const response = await axios.post("/api/auth/register", data);

    if (response.data.user) {
      this.setSession(response.data.access_token);
      return response.data.user;
    } else {
      return response.data.error;
    }
  };

  signInWithEmailAndPassword = async (username, password) => {
    try {
      const res = await axios.post("/auth/login/admin ", {
        username,
        password,
      });

      if (res.data != null) {
        this.setSession(res.data.accessToken);
        window.localStorage.setItem("jwt_access_token", res.data.accessToken);

        Sentry.setUser({
          companyDb: res.data.companyDb,
          organizationName: res.data.defaultOrganizationAccess.organizationName,
          userId: res.data.userId,
          userType: res.data.userType,
          username: res.data.username,
          segment: "admin",
        });

        return res.data;
      }
    } catch (error: any) {
      if (error?.response?.data?.message != null) {
        throw new Error(error.response.data.message);
      }

      throw new Error(error);
    }
  };

  signInWithEmployeeIdAndPassword = async (employeeId, password) => {
    try {
      const res = await axios.post("/auth/login/employee ", {
        employeeId,
        password,
      });

      if (res.data) {
        this.setSession(res.data.accessToken);
        window.localStorage.setItem("jwt_access_token", res.data.accessToken);

        Sentry.setUser({
          companyDb: res.data.companyDb,
          organizationName: res.data.defaultOrganizationAccess.organizationName,
          userId: res.data.userId,
          userType: res.data.userType,
          username: res.data.username,
          segment: "employee",
        });

        return res.data;
      }
    } catch (error: any) {
      if (error?.response?.data?.message != null) {
        throw new Error(error.response.data.message);
      }

      throw new Error(error);
    }
  };

  signInWithToken = async () => {
    try {
      await checkFirst();

      const accessToken = this.getAccessToken();
      if (accessToken == null) {
        this.setSession(null);
        return;
      }

      const res = await axios.get("/auth/checkValidToken", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      Sentry.setUser({
        companyDb: res.data.companyDb,
        organizationName: res.data.defaultOrganizationAccess.organizationName,
        userId: res.data.userId,
        userType: res.data.userType,
        username: res.data.username,
      });

      if (res.data) {
        this.setSession(res.data.accessToken);
        return res.data;
      }

      throw new Error("Failed to sign in");
    } catch (error: any) {
      this.setSession(null);
      throw new Error(error);
    }
  };

  updateUserData = async (user) => {
    return await axios.post("/api/auth/user/update", {
      user,
    });
  };

  setSession = (accessToken) => {
    if (accessToken) {
      localStorage.setItem("jwt_access_token", accessToken);
      axios.defaults.headers.common.Authorization = "Bearer " + accessToken;
    } else {
      localStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
      Sentry.setUser(null);
    }
  };

  isAuthTokenValid = (accessToken) => {
    if (!accessToken) {
      return false;
    }
    const decoded = jwtDecode<any>(accessToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return false;
    } else {
      return true;
    }
  };

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;

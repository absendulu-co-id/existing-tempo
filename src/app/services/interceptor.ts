import * as Sentry from "@sentry/react";
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// https://dev.to/charlintosh/setting-up-axios-interceptors-react-js-typescript-12k5

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return config;
};

const onRequestError = async (error: AxiosError): Promise<AxiosError> => {
  Sentry.captureException(error, {
    level: "error",
    fingerprint: ["axios-request-error"],
  });

  return await Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (error: AxiosError, logout: () => void): Promise<any | undefined> => {
  const url = (error.request as XMLHttpRequest).responseURL;
  if (url.includes("auth") || url.includes("login")) {
    return await Promise.reject(error);
  }

  if (error.response) {
    if (error.response.status == 401 && !(error.config as any)?.__isRetryRequest) {
      logout();
      return;
    }
    if (error.response.status == 404 && (error.response.data.message as string).toLowerCase().includes("empty")) {
      return error.response;
    }
  }

  Sentry.captureException(error, {
    level: "error",
    fingerprint: ["axios-reponse-error"],
  });

  return await Promise.reject(error);
};

export function setupInterceptors(axiosInstance: AxiosInstance, logout: () => void): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, async (error) => await onResponseError(error, logout));
  return axiosInstance;
}

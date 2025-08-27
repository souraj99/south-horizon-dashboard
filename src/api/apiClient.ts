/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import { store } from "../store/store";
import { showToast } from "../lib/utils";

// Default headers
export const defaultHeaders: Record<string, string> = {
  Accept: "*/*",
  "Content-Type": "application/json",
};

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: defaultHeaders,
});

// Response handler
const handleSuccess = (response: any) => {
  return response.data;
};

// Error handler
const handleError = (error: AxiosError | any) => {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as any)?.message || "Something went wrong";
    const code = error.response?.status || 500;

    showToast(message, "error");

    return Promise.reject({
      code,
      message,
      details: error.response?.data,
    });
  } else {
    showToast("error", "Unexpected error occurred");
    return Promise.reject(error);
  }
};

// Generic request function
export const sendApiRequest = async (
  url: string,
  data?: any,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "POST",
  headers: Record<string, string> = defaultHeaders,
  toastMessages?: { success?: string; error?: string }
) => {
  try {
    const config = {
      method,
      url,
      headers,
      ...(method === "GET" ? { params: data } : { data }),
    };

    const response = await apiClient(config);

    if (toastMessages?.success) {
      showToast("success", toastMessages.success);
    }

    return handleSuccess(response);
  } catch (error) {
    if (toastMessages?.error) {
      showToast("error", toastMessages.error);
    }
    return handleError(error);
  }
};

// Authorized API Call
export const authorizedApiCall = (
  url: string,
  data?: any,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "POST",
  toastMessages?: { success?: string; error?: string }
) => {
  const accessDetails: any = store.getState().auth;
  const token = accessDetails?.authToken || accessDetails?.accessToken || "";
  const headers = {
    Authorization: `Bearer ${token}`,
    ...defaultHeaders,
  };
  return sendApiRequest(url, data, method, headers, toastMessages);
};

// Unauthorized API Call
export const unauthorizedApiCall = (
  url: string,
  data?: any,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "POST",
  toastMessages?: { success?: string; error?: string }
) => {
  return sendApiRequest(url, data, method, defaultHeaders, toastMessages);
};

import axios from "axios";
import * as Keychain from "react-native-keychain";
import TokenService from "./token.service";
import { BASE_URL } from "../types/path";
import { refreshTokenService } from "./user.service";
import { ErrorCode } from "../enums/ErrorCode";
import { AppError } from "../types/error";

const axiosInstance = axios.create({
  baseURL: BASE_URL || "http://192.168.1.6:5000/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

axiosInstance.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

// Gắn access token vào mỗi request
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = await TokenService.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Xử lý refresh token khi access token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.data.errorCode === ErrorCode.TOKEN_EXPIRED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Lấy access token mới
        const newAccessToken = await refreshTokenService();

        // Gửi lại request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh token lỗi → logout
        await Keychain.resetGenericPassword();
      }
    }

    // Chuẩn hóa lỗi từ backend — TRẢ VỀ DẠNG AppError
    if (error.response?.data) {
      const { message, errorCode } = error.response.data;

      const appError: AppError = {
        message: message || "Đã xảy ra lỗi",
        errorCode: errorCode || null,
        // status: error.response.status,
      };

      return Promise.reject(appError); // ném lỗi dạng AppError
    }
  }
);

export default axiosInstance;

import { LoginValues, RegisterValues } from "../types/user";
import axiosInstance from "./axiosInstance";
import TokenService from "./token.service";

export const refreshTokenService = async () => {
  const refreshToken = await TokenService.getRefreshToken();
  if (!refreshToken) throw new Error("No tokens found");

  const response = await axiosInstance.post("/users/refresh", {
    refreshToken,
  });
  const newAccessToken = response.data.result.accessToken;

  await TokenService.saveTokens(newAccessToken, refreshToken);
  return newAccessToken;
};

export const updateProfileService = async (formData: FormData) => {
  const response = await axiosInstance.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.result; // updated user info
};

export const checkAuthService = async () => {
  const accessToken = await TokenService.getAccessToken();
  if (!accessToken) throw new Error("No token");

  const response = await axiosInstance.get("/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.data.result; // user info
};

export const testAuthService = async () => {
  const accessToken = await TokenService.getAccessToken();
  if (!accessToken) throw new Error("No token");

  const response = await axiosInstance.get("/users/test", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.data.result; // user info
};

export const registerUserService = async (registerValues: RegisterValues) => {
  const response = await axiosInstance.post("/users/register", {
    username: registerValues.username,
    email: registerValues.email,
    password: registerValues.password,
  });
  return response.data;
};

export const loginUserService = async (loginValues: LoginValues) => {
  const response = await axiosInstance.post("/users/login", {
    username: loginValues.username,
    password: loginValues.password,
  });
  // console.log("Login response:", response.data.data.user);
  const { accessToken, refreshToken, user } = response.data.result;

  // Lưu tokens vào SecureStore
  await TokenService.saveTokens(accessToken, refreshToken);

  return user;
};

export const logoutUserService = async () => {
  // Xoá tokens khỏi SecureStore
  await TokenService.deleteTokens();
  return true;
};

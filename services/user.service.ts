import { LoginValues, RegisterValues } from "../types/user";
import axiosInstance from "./axiosInstance";
import TokenService from "./token.service";

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
  console.log("Login response:", response.data.data.user);
  const { accessToken, refreshToken, user } = response.data.data;

  // Lưu tokens vào SecureStore
  await TokenService.saveTokens(accessToken, refreshToken);

  return user;
};

export const logoutUserService = async () => {
  // Xoá tokens khỏi SecureStore
  await TokenService.deleteTokens();
  return true;
};

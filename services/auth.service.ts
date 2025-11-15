import axiosInstance from "./axiosInstance";

export interface SecretResponse {
  secret: string;
  keyUri: string;
}

export const generateSecretService = async (): Promise<SecretResponse> => {
  const response = await axiosInstance.get("/auth/totp");

  return response.data.result;
};

export const enableTOTPService = async (token: string): Promise<boolean> => {
  const response = await axiosInstance.put("/auth/totp", { token });

  return response.data.result;
};

export const disableTOTPService = async (token: string): Promise<boolean> => {
  const response = await axiosInstance.delete(`/auth/totp/${token}`);

  return response.data.result;
};

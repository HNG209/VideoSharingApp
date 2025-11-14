import axiosInstance from "./axiosInstance";

export interface SecretResponse {
  secret: string;
  keyUri: string;
}

export const generateSecretService = async (): Promise<SecretResponse> => {
  const response = await axiosInstance.get("/auth/totp");

  return response.data.result;
};

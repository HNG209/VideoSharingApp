import axiosInstance from "./axiosInstance";

export const uploadPostService = async (formData: FormData) => {
  const response = await axiosInstance.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.result;
};

import axiosInstance from "./axiosInstance";

export const uploadPostService = async (
  formData: FormData,
  onProgress?: (percent: number) => void
) => {
  const response = await axiosInstance.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        onProgress?.(percent);
      }
    },
  });

  return response.data.result;
};

export const fetchUserPostService = async () => {
  const response = await axiosInstance.get("/posts");

  return response.data.result;
};

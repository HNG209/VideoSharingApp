import axiosInstance from "./axiosInstance";

export const followUserService = async (userId: string) => {
  const response = await axiosInstance.post("/follow", {
    followingId: userId,
  });

  return response.data.message;
};

export const unfollowUserService = async (userId: string) => {
  const response = await axiosInstance.post("/unfollow", {
    followingId: userId,
  });

  return response.data.message;
};
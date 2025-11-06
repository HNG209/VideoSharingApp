import { LikeRequest, LikeResponse } from "../types/like";
import axiosInstance from "./axiosInstance";

export const likeService = {
  toggleLike: async (payload: LikeRequest): Promise<LikeResponse> => {
    const response = await axiosInstance.post("/likes", {
      targetId: payload.targetId,
      onModel: payload.onModel,
    });
    return response.data.result;
  },
};

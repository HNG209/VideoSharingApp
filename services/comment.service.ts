import { CommentCreateRequest } from "../types/comment";
import axiosInstance from "./axiosInstance";

export const createCommentService = async (comment: CommentCreateRequest) => {
  const response = await axiosInstance.post("/comments", comment);
  return response.data.result;
};

export const fetchCommentsByPostService = async (postId: string) => {
  const response = await axiosInstance.get(`/comments/post/${postId}`);
  return response.data.result;
};

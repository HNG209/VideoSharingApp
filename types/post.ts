import { PostAuthor, User } from "./user";

export interface Post {
  _id: string;
  author: PostAuthor;
  caption: string;
  tags: string[];
  media: {
    publicId: string;
    url: string;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  isLikedByCurrentUser: boolean;
  isSavedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
}

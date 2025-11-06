import { User } from "./user";

export interface Post {
  _id: string;
  author: User;
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
}

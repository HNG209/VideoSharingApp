export interface Post {
  _id: string;
  author: string;
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

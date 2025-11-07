export type CommentModel = {
  _id: string;
  author: CommentAuthor;
  post: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentCreateRequest = {
  post: string;
  content: string;
};

export interface CommentAuthor {
  _id: string;
  profile: {
    displayName: string;
    avatar: string;
  };
}

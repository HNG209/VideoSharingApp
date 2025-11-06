export interface Like {
  id: string;
  userId: string;
  targetId: string;
  onModel: string;
  createdAt: Date;
}

export interface LikeRequest {
  targetId: string;
  onModel: "post" | "comment";
}

export interface LikeResponse {
  liked: boolean;
//   message: string;
}

export interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  likeCount: number;
  followerCount: number;
  followingCount: number;
  profile: {
    displayName: string;
    bio: string;
    avatar: string;
  };
  secret:
    | {
        value: string;
        uri: string;
        verify: boolean;
      }
    | undefined
    | null;
}

export interface PostAuthor {
  _id: string;
  profile: {
    displayName: string;
    bio: string;
    avatar: string;
  };
}

export interface Friend {
  _id: string;
  username: string;
  email: string;
  isFollowed: boolean;
  isFollower: boolean;
  likeCount: number;
  followerCount: number;
  followingCount: number;
  profile: {
    displayName: string;
    bio: string;
    avatar: string;
  };
}

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
}

export interface LoginValues {
  username: string;
  password: string;
  otp?: string;
}

export interface RegisterValues {
  username: string;
  email: string;
  password: string;
}

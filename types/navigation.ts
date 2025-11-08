import { Post } from "./post";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
export type AppStackParamList = {
  Home: undefined;
  MyProfile: undefined;
  ProfileDetails: { id?: string } | undefined;
  Search: undefined;
  Friends?: undefined;
  CreateVideo?: undefined;
  Auth: undefined;
  Detail: { id: string };
};

export type CameraStackParamLlist = {
  Camera: undefined;
  PostVideo: { uri: string | null };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

export type MainTabParamList = {
  HomeStack: undefined;
  ProfileDrawer: undefined;
  Search: undefined;
  Friends?: undefined;
  CameraStack: undefined;
};

export type RootStackParamList = {
  VideoFeed: { initialPost: Post; feedType: "profile" | "other" | "home" };
  MainTab: undefined;
  OtherProfile: { userId: string };
};

export type HomeStackParamList = {
  Home: undefined;
  HomeFeed: undefined;
};

export type ProfileDrawerParamList = {
  ProfileStack: undefined;
  ChangePassword: undefined;
};

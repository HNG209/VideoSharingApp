import { NavigatorScreenParams } from "@react-navigation/native";
import { Post } from "./post";
import { User } from "./user";

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

export type CameraStackParamList = {
  Camera: undefined;
  PostVideo: { uri: string | null };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  ProfileDrawer: NavigatorScreenParams<ProfileDrawerParamList>;
  Search: undefined;
  Friends?: undefined;
  CameraStack: NavigatorScreenParams<CameraStackParamList>;
};

export type RootStackParamList = {
  VideoFeed: { initialPost: Post; feedType: "profile" | "other" | "home" };
  MainTab: NavigatorScreenParams<MainTabParamList>;
  OtherProfile: { userId: string };
  Follow: { initialTab?: "followers" | "following"; user: User | null };
};

export type HomeStackParamList = {
  Home: undefined;
  HomeFeed: undefined;
};

export type ProfileDrawerParamList = {
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  ChangePassword: undefined;
  Secure: undefined;
};

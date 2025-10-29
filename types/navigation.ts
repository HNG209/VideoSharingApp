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
  Home: undefined;
  MyProfile: undefined;
  ProfileDetails: { id?: string } | undefined;
  Search: undefined;
  Friends?: undefined;
  Create: undefined;
  Detail: { id: string };
};

export type ProfileDrawerParamList = {
  Profile: undefined;
  ChangePassword: undefined;
};

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

export type MainTabParamList = {
  Home: undefined;
  MyProfile: undefined;
  ProfileDetails: { id?: string } | undefined;
  Search: undefined;
  Friends?: undefined;
  CreateVideo?: undefined;
  Detail: { id: string };
};

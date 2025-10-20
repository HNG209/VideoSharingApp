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
  Login: undefined;
  Register: undefined;

  Detail: { id: string };

};

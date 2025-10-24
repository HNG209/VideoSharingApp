// navigation/AppStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTab } from "./MainTab";
import ProfileDetails from "../screens/ProfileDetails";
import EditProfileScreen from "../screens/EditProfileScreen";

type AppStackParamList = {
  Main: undefined;
  ProfileDetails: { id?: string } | undefined;
  EditProfile?: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTab} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit Profile" }} />
    </Stack.Navigator>
  );
}

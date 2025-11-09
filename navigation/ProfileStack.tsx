// src/navigation/AuthStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../types/navigation";
import MyProfileScreen from "../screens/MyProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import { VideoPostScreen } from "../screens/VideoPostScreen";
import FollowScreen from "../screens/FollowScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      {/* <Stack.Screen
        name="Follow"
        component={FollowScreen}
        initialParams={{ userId: "123", initialTab: "followers" }}
      /> */}
    </Stack.Navigator>
  );
}

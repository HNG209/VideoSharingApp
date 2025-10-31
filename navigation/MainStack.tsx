// src/navigation/AuthStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthStackParamList, MainStackParamList } from "../types/navigation";
import { MainTab } from "./MainTab";
import { VideoPostScreen } from "../screens/VideoPostScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen
        name="VideoPost"
        component={VideoPostScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
}

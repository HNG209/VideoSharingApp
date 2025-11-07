// src/navigation/AuthStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthStackParamList, HomeStackParamList } from "../types/navigation";
import HomeScreen from "../screens/HomeScreen";
import { HomeFeedScreen } from "../screens/HomeFeedScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeFeed"
        component={HomeFeedScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      {/* <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animation: "slide_from_left",
        }}
      /> */}
    </Stack.Navigator>
  );
}

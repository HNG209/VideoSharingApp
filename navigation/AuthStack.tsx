// src/navigation/AuthStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
}

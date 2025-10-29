import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CameraStackParamLlist } from "../types/navigation";
import RecordVideoScreen from "../screens/RecordVideoScreen";
import PostVideoScreen from "../screens/PostVideoScreen";

const Stack = createNativeStackNavigator<CameraStackParamLlist>();

export default function CameraStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Camera"
        component={RecordVideoScreen}
        options={{
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen
        name="PostVideo"
        component={PostVideoScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
}

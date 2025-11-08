import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { MainTab } from "./MainTab";
import { VideoFeedScreen } from "../screens/VideoFeedScreen";
import OtherProfileScreen from "../screens/OtherProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
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
        name="VideoFeed"
        component={VideoFeedScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="OtherProfile"
        component={OtherProfileScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
}

// import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 🔹 Import các màn hình
import MyProfileScreen from "./screens/MyProfileScreen";
import ProfileDetails from "./screens/ProfileDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MyProfile" // màn đầu tiên
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 🔹 Import các màn hình
import MyProfileScreen from "./screens/MyProfileScreen";
import ProfileDetails from "./screens/ProfileDetails";
import AuthStack from "./navigation/AuthStack";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store/store";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator></RootNavigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const RootNavigator = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
        </>
      )}
    </Stack.Navigator>
  );
};

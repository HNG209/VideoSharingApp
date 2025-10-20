import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./screens/HomeScreen";
import MyProfileScreen from "./screens/MyProfileScreen";
import ProfileDetails from "./screens/ProfileDetails";
import AuthStack from "./navigation/AuthStack";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store/store";
import SearchScreen from "./screens/SearchScreen";
import FriendsScreen from "./screens/FriendsScreen";
import { AppStackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
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
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

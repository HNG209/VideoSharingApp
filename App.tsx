import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./screens/HomeScreen";
import MyProfileScreen from "./screens/MyProfileScreen";
import ProfileDetails from "./screens/ProfileDetails";
import SearchScreen from "./screens/SearchScreen";
import FriendsScreen from "./screens/FriendsScreen" 
import { AppStackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
           <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          {/* <Stack.Screen name="Friends" component={FriendsScreen} /> */}
        {/* <Stack.Screen name="CreateVideo" component={CreateVideoScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

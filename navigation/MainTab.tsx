import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../types/navigation";
import HomeScreen from "../screens/HomeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import ProfileDetails from "../screens/ProfileDetails";
import SearchScreen from "../screens/SearchScreen";
import FriendsScreen from "../screens/FriendsScreen";
import { Ionicons } from "@expo/vector-icons";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Cấu hình icon cho từng tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "MyProfile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Friends") {
            iconName = focused ? "people" : "people-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ff2d7a",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyProfile" component={ProfileStack} />
      {/* <Tab.Screen name="ProfileDetails" component={ProfileDetails} /> */}
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
};

// src/navigation/MainTab.tsx
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

import HomeStack from "./HomeStack";
import SearchScreen from "../screens/SearchScreen";
import FriendsScreen from "../screens/FriendsScreen";
import { ProfileDrawer } from "./ProfileDrawer";
import CameraStack from "./CameraStack";
import { MainTabParamList } from "../types/navigation";
import AddButton from "../components/AddButton";

const Tab = createBottomTabNavigator<MainTabParamList>();

const COLORS = {
  pink: "#ff2d7a",
  grey: "gray",
  darkBg: "#111",
  lightBg: "#fff",
  darkText: "#fff",
  lightText: "#000",
};

export const MainTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        // Nếu đang ở tab Home → đổi sang dark mode
        const isHome = route.name === "HomeStack";

        return {
          headerShown: false,
          tabBarActiveTintColor: isHome ? COLORS.darkText : COLORS.pink,
          tabBarInactiveTintColor: isHome ? "#888" : COLORS.grey,
          tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: isHome ? COLORS.darkBg : COLORS.lightBg,
              borderTopColor: isHome ? "#222" : "#eee",
              height: 68 + insets.bottom / 2,
              paddingBottom: insets.bottom || 8,
            },
          ],

          tabBarIcon: ({ focused, color }) => {
            let icon: keyof typeof Ionicons.glyphMap = "home-outline";
            if (route.name === "HomeStack")
              icon = focused ? "home" : "home-outline";
            else if (route.name === "Search")
              icon = focused ? "search" : "search-outline";
            else if (route.name === "Friends")
              icon = focused ? "people" : "people-outline";
            else if (route.name === "ProfileDrawer")
              icon = focused ? "person" : "person-outline";

            return <Ionicons name={icon} size={22} color={color} />;
          },
        };
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="CameraStack"
        component={CameraStack}
        options={{
          tabBarStyle: { display: "none" },
          tabBarLabel: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => <AddButton {...props} />,
        }}
      />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen
        name="ProfileDrawer"
        component={ProfileDrawer}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 10,
  },
  addContainer: {
    position: "absolute",
    bottom: -4,
    left: "50%",
    transform: [{ translateX: -27 }],
  },
  addBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#ff2d7a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

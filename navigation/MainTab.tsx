// src/navigation/MainTab.tsx
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import FriendsScreen from "../screens/FriendsScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import { ProfileDrawer } from "./ProfileDrawer";
import RecordVideoScreen from "../screens/RecordVideoScreen"; // hoặc CreateVideoScreen
import CameraStack from "./CameraStack";
import { MainTabParamList } from "../types/navigation";
import { VideoPostScreen } from "../screens/VideoPostScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const PINK = "#ff2d7a";
const GREY = "gray";

export const MainTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: PINK,
        tabBarInactiveTintColor: GREY,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
        tabBarStyle: [
          styles.tabBar,
          {
            height: 68 + insets.bottom / 2, // cao hơn để cân nút giữa
            paddingBottom: insets.bottom || 8,
          },
        ],

        tabBarIcon: ({ focused, color }) => {
          let icon: keyof typeof Ionicons.glyphMap = "home-outline";
          if (route.name === "Home") icon = focused ? "home" : "home-outline";
          else if (route.name === "Search")
            icon = focused ? "search" : "search-outline";
          else if (route.name === "Friends")
            icon = focused ? "people" : "people-outline";
          else if (route.name === "MyProfile")
            icon = focused ? "person" : "person-outline";

          return <Ionicons name={icon} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />

      {/* Nút + giữa */}
      <Tab.Screen
        name="Create"
        component={CameraStack}
        options={{
          tabBarStyle: { display: "none" },
          tabBarLabel: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => <AddButton {...props} />,
        }}
      />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="MyProfile" component={ProfileDrawer} />
    </Tab.Navigator>
  );
};

function AddButton({ onPress }: any) {
  return (
    <View style={styles.addContainer}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.addBtn,
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
        android_ripple={{ color: "#ffd1e0", borderless: true }}
      >
        <Ionicons name="add" size={26} color="#ff2d7a" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    elevation: 10,
  },
  addContainer: {
    position: "absolute",
    bottom: -4, // chỉnh lên xuống nút thêm
    left: "50%",
    transform: [{ translateX: -27 }], // căn giữa tuyệt đối theo chiều ngang
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

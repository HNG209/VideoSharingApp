import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { useDispatch } from "react-redux";
import ProfileStack from "./ProfileStack";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import { ProfileDrawerParamList } from "../types/navigation";
import { logout } from "../store/slices/auth.slice";
import { AppDispatch } from "../store/store";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator<ProfileDrawerParamList>();

export const ProfileDrawer = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            dispatch(logout());
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={handleLogout} />
      )}
      screenOptions={{
        headerShown: true, // để có thể chỉnh header
        headerTitle: "", // ẩn tiêu đề
        headerShadowVisible: false, // ❌ bỏ đường viền / bóng đổ dưới header
        headerStyle: {
          backgroundColor: "#fff", // màu nền header
          elevation: 0, // Android: bỏ shadow
          shadowOpacity: 0, // iOS: bỏ shadow
          borderBottomWidth: 0, // ❌ bỏ đường viền
        },
        headerTintColor: "#ff2d7a", // 🎨 đổi màu icon menu (và icon back)
        drawerActiveTintColor: "#ff2d7a",
        drawerInactiveTintColor: "#8E8E93",
        drawerItemStyle: {
          borderBottomWidth: 0,
          borderRadius: 10,
          marginVertical: 5,
        },
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: "Trang cá nhân",
        }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: "Đổi mật khẩu",
        }}
      />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props: any) => {
  const { onLogout, state, navigation, descriptors } = props;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const { title } = descriptors[route.key].options;

        return (
          <DrawerItem
            key={route.key}
            label={title ?? route.name}
            focused={focused}
            onPress={() => navigation.navigate(route.name)}
            labelStyle={[
              styles.drawerLabel,
              focused && styles.drawerLabelActive,
            ]}
            style={[styles.drawerItem, focused && styles.drawerItemActive]}
          />
        );
      })}

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    borderRadius: 10,
    marginVertical: 5,
  },
  drawerItemActive: {
    backgroundColor: "#f2f3ff",
  },
  drawerLabel: {
    color: "#8E8E93",
    fontSize: 16,
  },
  drawerLabelActive: {
    color: "#ff2d7a",
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff2d7a",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

import { ProfileDrawerParamList } from "../types/navigation";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileStack from "./ProfileStack";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

const Drawer = createDrawerNavigator<ProfileDrawerParamList>();

export const ProfileDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: "Trang cá nhân" }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "Đổi mật khẩu" }}
      />
    </Drawer.Navigator>
  );
};

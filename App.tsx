import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthStack from "./navigation/AuthStack";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { AppDispatch, RootState } from "./store/store";
import { MainTab } from "./navigation/MainTab";
import { use, useEffect } from "react";
import { checkAuth } from "./store/slices/auth.slice";
import { Alert } from "react-native";

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
  const dispatch = useDispatch<AppDispatch>();

  // Check authentication status on app start
  useEffect(() => {
    try {
      // console.log("Checking auth");
      setTimeout(() => {
        dispatch(checkAuth()).unwrap();
      }, 1000);
    } catch (error) {
      Alert.alert(
        "Phiên đăng nhập đã hết hạn",
        "Hãy đăng nhập lại vào tài khoản của bạn"
      );
      console.error("Failed to check auth:", error);
    }
  }, [dispatch]);

  return <>{isLoggedIn ? <MainTab /> : <AuthStack />}</>;
};

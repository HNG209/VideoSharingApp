// App.tsx
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";

import store, { AppDispatch, RootState } from "./store/store";
import AuthStack from "./navigation/AuthStack";
import AppStack from "./navigation/AppStack";  
import { checkAuth } from "./store/slices/auth.slice";

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

  useEffect(() => {
    // trễ nhẹ để store/rehydrate xong (nếu có)
    const t = setTimeout(() => {
      dispatch(checkAuth())
        .unwrap()
        .catch(() => {
          Alert.alert(
            "Phiên đăng nhập đã hết hạn",
            "Hãy đăng nhập lại vào tài khoản của bạn"
          );
        });
    }, 300);
    return () => clearTimeout(t);
  }, [dispatch]);

  return isLoggedIn ? <AppStack /> : <AuthStack />;
};

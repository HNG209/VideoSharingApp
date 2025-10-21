import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthStack from "./navigation/AuthStack";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store/store";
import { MainTab } from "./navigation/MainTab";

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

  return <>{isLoggedIn ? <MainTab /> : <AuthStack />}</>;
};

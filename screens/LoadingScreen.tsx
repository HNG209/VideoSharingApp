import React from "react";
import { View, ActivityIndicator, Image, StyleSheet } from "react-native";

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")} // Đảm bảo logo của bạn nằm trong thư mục assets
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#ff2d7a" />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
});

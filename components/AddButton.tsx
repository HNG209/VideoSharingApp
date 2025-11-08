import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

function AddButton({ onPress }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.addContainer}>
      <Animated.View style={[styles.shadowWrapper, animatedStyle]}>
        <Pressable
          onPressIn={() => (scale.value = withSpring(0.92))}
          onPressOut={() => (scale.value = withSpring(1))}
          onPress={onPress}
          android_ripple={{ color: "#fff4", borderless: true }}
          style={({ pressed }) => [
            styles.addBtnOuter,
            pressed && { opacity: 0.9 },
          ]}
        >
          {/* Gradient viền ngoài */}
          <LinearGradient
            colors={["#ff4fa7", "#c43fff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            {/* Nền trắng phía trong */}
            <View style={styles.addBtnInner}>
              <Ionicons name="add" size={28} color="#ff2d7a" />
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  addContainer: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    transform: [{ translateX: -30 }],
  },
  shadowWrapper: {
    shadowColor: "#ff2d7a",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  addBtnOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBorder: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    padding: 3,
  },
  addBtnInner: {
    flex: 1,
    borderRadius: 27,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddButton;

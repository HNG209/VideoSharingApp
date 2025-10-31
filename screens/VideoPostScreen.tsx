import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  MainStackParamList,
  MainTabParamList,
  ProfileStackParamList,
} from "../types/navigation";

const { height, width } = Dimensions.get("window");

const PINK = "#ff2d7a";
const GREY = "#8E8E93";

type Props = Partial<NativeStackScreenProps<MainStackParamList, "VideoPost">>;

export const VideoPostScreen: React.FC<Props> = ({ navigation, route }) => {
  const post = route?.params.post;
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressVideo = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setLiked((prev) => !prev);

    // hiệu ứng phóng to nhẹ
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressVideo}>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: post?.media.url }}
          style={styles.video}
          resizeMode="cover"
          useNativeControls={true}
          shouldPlay
          isLooping
          onError={(e) => console.log("VIDEO ERROR:", e)}
        />

        {/* Nút trở về */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        {/* Thông tin caption */}
        <View style={styles.bottomInfo}>
          <Text style={styles.author}>@{post?.author}</Text>
          <Text style={styles.caption}>{post?.caption}</Text>
        </View>

        {/* Cột icon bên phải */}
        <View style={styles.rightColumn}>
          <TouchableOpacity onPress={handleLike} activeOpacity={0.7}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={36}
                color={liked ? PINK : GREY}
              />
            </Animated.View>
            <Text style={styles.iconLabel}>
              {liked ? post?.likeCount + 1 : post?.likeCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons
              name="chatbubble-outline"
              size={32}
              color={GREY}
              style={styles.icon}
            />
            <Text style={styles.iconLabel}>{post?.commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons
              name="bookmark-outline"
              size={32}
              color={GREY}
              style={styles.icon}
            />
            <Text style={styles.iconLabel}>{post?.saveCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height,
    width,
    backgroundColor: "black",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 6,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  bottomInfo: {
    position: "absolute",
    bottom: 90,
    left: 16,
    width: "70%",
  },
  author: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  caption: {
    color: "white",
    marginTop: 6,
    fontSize: 14,
  },
  rightColumn: {
    position: "absolute",
    bottom: 100,
    right: 16,
    alignItems: "center",
  },
  icon: {
    marginTop: 26,
  },
  iconLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});

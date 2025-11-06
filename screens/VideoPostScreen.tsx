import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../types/post";

const { height, width } = Dimensions.get("window");
const PINK = "#ff2d7a";
const GREY = "#8E8E93";

type Props = {
  post: Post;
  isVisible?: boolean;
};

export const VideoPostScreen: React.FC<Props> = ({ post, isVisible }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showStopBtn, setShowStopBtn] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVisible) {
      videoRef.current.playAsync().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pauseAsync().catch(() => {});
      setIsPlaying(false);
      setShowStopBtn(false);
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      videoRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const handlePressVideo = useCallback(async () => {
    setShowStopBtn((prev) => !prev);
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleLike = useCallback(() => {
    setLiked((prev) => !prev);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleStop = async () => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
      await videoRef.current.setPositionAsync(0);
      setIsPlaying(false);
      setShowStopBtn(false);
    }
  };

  // Xử lý tuỳ chọn
  const handleDelete = () => {
    setShowOptions(false);
    // TODO: Xử lý xoá post
  };
  const handleEdit = () => {
    setShowOptions(false);
    // TODO: Chuyển sang màn hình chỉnh sửa post
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressVideo}>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: post?.media?.url }}
          style={styles.video}
          resizeMode="contain"
          shouldPlay={false}
          isLooping
          isMuted={isMuted}
          onError={(e) => console.warn("Video error:", e)}
          volume={1.0}
        />

        {/* Nút dừng ở giữa màn hình, chỉ hiển thị khi showStopBtn = true */}
        {showStopBtn && (
          <View style={styles.centerStopBtnWrapper}>
            <TouchableOpacity onPress={handleStop} style={styles.centerStopBtn}>
              <Ionicons name="stop" size={48} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Nút tắt/bật âm thanh ở góc trên */}
        {/* <View style={styles.topRight}>
          <TouchableOpacity
            onPress={handleToggleMute}
            style={styles.controlBtn}
          >
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={26}
              color="#fff"
            />
          </TouchableOpacity>
        </View> */}

        {/* Modal tuỳ chọn */}
        <Modal
          visible={showOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowOptions(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowOptions(false)}
          >
            <View style={styles.optionsMenu}>
              <TouchableOpacity style={styles.optionItem} onPress={handleEdit}>
                <Ionicons name="create-outline" size={20} color={PINK} />
                <Text style={styles.optionText}>Chỉnh sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                <Text style={[styles.optionText, { color: "#e74c3c" }]}>
                  Xoá
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => setShowOptions(false)}
              >
                <Ionicons name="close" size={20} color={GREY} />
                <Text style={styles.optionText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Caption */}
        <View style={styles.bottomInfo}>
          <Text style={styles.author}>{post?.author?.profile.displayName}</Text>
          <Text style={styles.caption} numberOfLines={3}>
            {post?.caption}
          </Text>
        </View>

        {/* Icon bên phải */}
        <View style={styles.rightColumn}>
          {/* avatar */}
          <Image
            source={{ uri: post?.author?.profile.avatar }}
            style={styles.avatar}
          />

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

          <TouchableOpacity activeOpacity={0.7} style={styles.iconGroup}>
            <Ionicons name="chatbubble-outline" size={32} color={GREY} />
            <Text style={styles.iconLabel}>{post?.commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.iconGroup}>
            <Ionicons name="bookmark-outline" size={32} color={GREY} />
            <Text style={styles.iconLabel}>{post?.saveCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconGroup}
            onPress={() => setShowOptions(true)}
          >
            <Ionicons name="ellipsis-vertical" size={32} color={GREY} />
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
  },
  video: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    backgroundColor: "black",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 24,
  },
  centerStopBtnWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -32,
    marginTop: -32,
    zIndex: 20,
  },
  centerStopBtn: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 32,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  topRight: {
    position: "absolute",
    top: 40,
    right: 16 + 40, // dịch sang trái để không đè lên nút options
    flexDirection: "column",
    gap: 12,
    zIndex: 10,
  },
  topOptions: {
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 20,
  },
  optionsBtn: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  optionsMenu: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 18,
    paddingBottom: 32,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
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
  iconGroup: {
    marginTop: 26,
    alignItems: "center",
  },
  iconLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});

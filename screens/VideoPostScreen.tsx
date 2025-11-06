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
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../types/post";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { toggleLike } from "../store/slices/like.slice";
import CommentCard from "../components/CommentCard";

// Dummy comment data for demo
const dummyComments = [
  {
    _id: "1",
    user: {
      username: "john_doe",
      profile: {
        displayName: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
    },
    content: "Video hay quá!",
    createdAt: "2024-06-01T12:00:00Z",
  },
  {
    _id: "2",
    user: {
      username: "jane_smith",
      profile: {
        displayName: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
    },
    content: "Tuyệt vời 👏",
    createdAt: "2024-06-01T12:05:00Z",
  },
  {
    _id: "3",
    user: {
      username: "jane_smith",
      profile: {
        displayName: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
    },
    content: "Tuyệt vời 👏",
    createdAt: "2024-06-01T12:05:00Z",
  },
];

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
  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [showStopBtn, setShowStopBtn] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

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
    dispatch(toggleLike({ targetId: post._id, onModel: "post" }));
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

  const handleViewProfile = () => {
    // TODO: Xử lý xem hồ sơ người dùng
    // nếu là người dùng hiện tại thì chuyển đến trang cá nhân
    // nếu là người dùng khác thì chuyển đến trang xem người dùng đó
    if (user?.id === post.author._id) {
      // navigation.navigate("Profile");
    } else {
      // navigation.navigate("UserProfile", { userId: post.author._id });
    }
  };

  // Comment input state
  const [commentInput, setCommentInput] = useState("");

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

        {/* Modal comment */}
        <Modal
          visible={showCommentModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCommentModal(false)}
        >
          <KeyboardAvoidingView
            style={styles.commentModalContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <TouchableOpacity
              style={styles.commentModalOverlay}
              activeOpacity={1}
              onPress={() => setShowCommentModal(false)}
            />
            <View style={styles.commentModalContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentCount}>
                  {post.commentCount} bình luận
                </Text>
                <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                  <Ionicons name="close" size={24} color="#222" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={dummyComments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <CommentCard comment={item} />}
                contentContainerStyle={{ paddingBottom: 12 }}
                showsVerticalScrollIndicator={false}
              />
              <View style={styles.commentInputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Viết bình luận..."
                  value={commentInput}
                  onChangeText={setCommentInput}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity
                  style={styles.commentSendBtn}
                  onPress={() => setCommentInput("")}
                  disabled={!commentInput.trim()}
                >
                  <Ionicons name="send" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
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
          <TouchableOpacity>
            <Image
              source={{ uri: post?.author?.profile.avatar }}
              style={styles.avatar}
            />
          </TouchableOpacity>

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

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconGroup}
            onPress={() => setShowCommentModal(true)}
          >
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
  commentModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  commentModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  commentModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.7,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
  },
  commentCount: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    backgroundColor: "#fafbfc",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: "#222",
    marginRight: 8,
  },
  commentSendBtn: {
    backgroundColor: PINK,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
});

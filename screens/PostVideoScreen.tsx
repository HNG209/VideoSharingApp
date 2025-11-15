import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { uploadPostService } from "../services/post.service";
import { uploadPost } from "../store/slices/user.post.slice";
import { CameraStackParamList } from "../types/navigation";

const PINK = "#ff2d7a";
const BG = "#fff";

type Props = NativeStackScreenProps<CameraStackParamList, "PostVideo">;

const MAX_TAGS = 5;

const PostVideoScreen: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { uri } = route.params;
  const insets = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.auth.user);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    console.log("progress" + progress);
  }, [progress]);

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("video", {
      uri, // đường dẫn file cục bộ
      type: "video/mp4", // hoặc loại file phù hợp
      name: "video.mp4", // tên file
    } as any);
    // Thêm các trường khác nếu cần
    formData.append("caption", caption);
    formData.append("tags", JSON.stringify(tags)); // nếu tags là mảng

    dispatch(uploadPost({ formData, onProgress: setProgress }));
    navigation.goBack();
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (
      newTag &&
      !tags.includes(newTag) &&
      tags.length < MAX_TAGS &&
      /^[\w\d_]+$/.test(newTag)
    ) {
      setTags([...tags, newTag]);
      setTagInput("");
      Keyboard.dismiss();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <ScrollView
      style={[styles.container, { marginTop: insets.top }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={PINK} />
        </Pressable>
        <Text style={styles.headerText}>Đăng video mới</Text>
      </View>

      {/* User Info */}
      <View style={styles.userRow}>
        <Image
          source={{
            uri: user?.profile.avatar,
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.displayName}>{user?.profile.displayName}</Text>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>
      </View>

      {/* Video Thumbnail */}
      <View style={styles.videoBox}>
        <Video
          source={{ uri }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={false}
          useNativeControls
        />
      </View>

      {/* Caption Input */}
      <View style={styles.captionBox}>
        <TextInput
          style={styles.captionInput}
          placeholder="Viết caption cho video..."
          placeholderTextColor="#aaa"
          value={caption}
          onChangeText={(text) => {
            if (text.length <= 500) setCaption(text);
          }}
          multiline
          maxLength={500}
          blurOnSubmit={true}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <Text style={styles.captionCount}>{caption.length}/500</Text>
      </View>

      {/* Tag Input */}
      <View style={styles.tagBox}>
        <View style={styles.tagInputRow}>
          <TextInput
            style={styles.tagInput}
            placeholder="Thêm tag (tối đa 5)"
            placeholderTextColor="#aaa"
            value={tagInput}
            onChangeText={setTagInput}
            editable={tags.length < MAX_TAGS}
            returnKeyType="done"
            onSubmitEditing={handleAddTag}
            blurOnSubmit={true}
            maxLength={20}
          />
          <Pressable
            style={[
              styles.addTagBtn,
              (tags.length >= MAX_TAGS || !tagInput.trim()) && { opacity: 0.5 },
            ]}
            onPress={handleAddTag}
            disabled={tags.length >= MAX_TAGS || !tagInput.trim()}
          >
            <Feather name="plus" size={18} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <View style={styles.tagItem} key={tag}>
              <Text style={styles.tagText}>#{tag}</Text>
              <TouchableOpacity
                style={styles.removeTagBtn}
                onPress={() => handleRemoveTag(tag)}
              >
                <Feather name="x" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Post Button */}
      <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
        <Text style={styles.postBtnText}>Đăng video</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostVideoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: PINK,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
    backgroundColor: "#eee",
  },
  displayName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },
  username: {
    color: "#8b97a8",
    fontSize: 13,
  },
  videoBox: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    height: 220,
  },
  video: {
    width: "100%",
    height: "100%",
    minHeight: 220,
  },
  captionBox: {
    marginBottom: 18,
    position: "relative",
  },
  captionInput: {
    backgroundColor: "#f4f5f7",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#222",
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: "top",
  },
  captionCount: {
    position: "absolute",
    right: 12,
    bottom: 8,
    color: "#aaa",
    fontSize: 13,
  },
  tagBox: {
    marginBottom: 18,
  },
  tagInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: "#222",
  },
  addTagBtn: {
    backgroundColor: PINK,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PINK,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    gap: 4,
  },
  tagText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  removeTagBtn: {
    marginLeft: 4,
    padding: 2,
  },
  postBtn: {
    backgroundColor: PINK,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  postBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

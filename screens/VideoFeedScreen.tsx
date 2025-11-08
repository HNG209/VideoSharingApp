import React, { useRef, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { VideoPostScreen } from "./VideoPostScreen";
import { RootState } from "../store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

const { height } = Dimensions.get("window");

type Props = Partial<NativeStackScreenProps<RootStackParamList, "VideoFeed">>;

export const VideoFeedScreen = ({ route, navigation }: Props) => {
  const flatListRef = useRef<FlatList>(null);
  const feedType = route?.params?.feedType;
  const initialPost = route?.params?.initialPost;
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const posts = useSelector((state: RootState) => {
    if (feedType === "other") return state.otherUserPost.posts;
    // if (feedType === "global") return state.globalPost.posts;
    return state.userPost.posts;
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setVisibleIndex(viewableItems[0].index);
      }
    }
  ).current;

  // ✅ Dùng useMemo để tránh tính lại mỗi lần render
  const initialIndex = useMemo(() => {
    const idx = posts.findIndex((p) => p._id === initialPost?._id);
    return idx >= 0 ? idx : 0;
  }, [posts, initialPost]);

  // ✅ Tránh FlatList render khi chưa có data
  if (!posts || posts.length === 0) {
    return <View style={[styles.container, { backgroundColor: "black" }]} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item._id}
        // renderItem={({ item }) => <VideoPostScreen post={item} />}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        windowSize={3}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        renderItem={({ item, index }) => (
          <VideoPostScreen post={item} isVisible={index === visibleIndex} />
        )}
        initialScrollIndex={initialIndex}
        onScrollToIndexFailed={({ index }) => {
          console.warn("Scroll failed, fallback to safe index:", index);
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: Math.max(0, Math.min(index, posts.length - 1)),
              animated: false,
            });
          }, 300);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // tránh bị flicker trắng khi render video
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
});

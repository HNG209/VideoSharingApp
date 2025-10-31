import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { Post } from "../types/post";

type VideoCardProps = {
  post: Post;
  onPress?: () => void;
  onLongPress?: () => void;
  borderRadius?: number;
  width?: number;
  height?: number;
  aspectRatio?: number;
  testID?: string;
};

function formatViews(v?: number | string): string {
  if (v === undefined || v === null) return "0";
  const n =
    typeof v === "string" ? Number(v.toString().replace(/[^\d.-]/g, "")) : v;
  if (Number.isNaN(n)) return String(v);
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

const VideoCard: React.FC<VideoCardProps> = React.memo(
  ({
    post,
    onPress,
    onLongPress,
    borderRadius = 10,
    width = 120,
    height,
    aspectRatio = 9 / 16,
    testID,
  }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={[
          styles.card,
          {
            width,
            borderRadius,
            ...(height ? { height } : { aspectRatio }),
          },
        ]}
        testID={testID}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Video, ${formatViews(post.viewCount)} views`}
      >
        <Video
          source={{ uri: post.media.url }}
          style={[styles.thumbnail, { borderRadius }]}
          resizeMode="cover"
          shouldPlay={false}
          useNativeControls={false}
          onLoadStart={() => {
            setLoading(true);
            setError(false);
          }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />

        {/* Placeholder khi loading */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator />
          </View>
        )}

        {/* Fallback khi lỗi video */}
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>Video failed</Text>
          </View>
        )}

        {/* Overlay views & caption */}
        <View style={styles.overlay}>
          <Text style={styles.viewsText}>
            ▶ {formatViews(post.viewCount)} views
          </Text>
          <Text style={styles.captionText} numberOfLines={1}>
            {post.caption}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

export default VideoCard;

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  thumbnail: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  viewsText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  captionText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  loadingOverlay: {
    ...(StyleSheet.absoluteFillObject as any),
    alignItems: "center",
    justifyContent: "center",
  },
  errorOverlay: {
    ...(StyleSheet.absoluteFillObject as any),
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: { color: "#666", fontSize: 12 },
});

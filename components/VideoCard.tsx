// src/components/VideoCard.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";

export interface VideoCardProps {
  thumbnail: string | ImageSourcePropType; // URL hoặc require()
  views?: number | string;                 // chấp nhận số hoặc chuỗi
  onPress?: () => void;
  onLongPress?: () => void;
  borderRadius?: number;
  width?: number;
  height?: number;
  aspectRatio?: number;                    // nếu không truyền height -> dùng tỉ lệ
  testID?: string;
}

/** Định dạng view-count: 15230 -> 15.2K, 2300000 -> 2.3M */
function formatViews(v?: number | string): string {
  if (v === undefined || v === null) return "0";
  const n = typeof v === "string" ? Number(v.toString().replace(/[^\d.-]/g, "")) : v;
  if (Number.isNaN(n)) return String(v);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

const VideoCard: React.FC<VideoCardProps> = React.memo(
  ({
    thumbnail,
    views = 0,
    onPress,
    onLongPress,
    borderRadius = 10,
    width = 120,
    height,               // nếu không truyền height, sẽ dùng aspectRatio
    aspectRatio = 9 / 16, // dọc kiểu TikTok
    testID,
  }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const source = useMemo(
      () =>
        typeof thumbnail === "string" ? { uri: thumbnail } : (thumbnail as ImageSourcePropType),
      [thumbnail]
    );

    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        android_ripple={{ color: "rgba(0,0,0,0.08)" }}
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
        accessibilityLabel={`Video, ${formatViews(views)} views`}
      >
        <Image
          source={source}
          style={[styles.thumbnail, { borderRadius }]}
          resizeMode="cover"
          onLoadStart={() => {
            setLoading(true);
            setError(false);
          }}
          onLoadEnd={() => setLoading(false)}
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

        {/* Fallback khi lỗi ảnh */}
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>Image failed</Text>
          </View>
        )}

        {/* Overlay views */}
        <View style={styles.overlay}>
          <Text style={styles.viewsText}>▶ {formatViews(views)} views</Text>
        </View>
      </Pressable>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject as any,
    alignItems: "center",
    justifyContent: "center",
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: { color: "#666", fontSize: 12 },
});

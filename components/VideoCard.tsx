// src/components/VideoCard.tsx
import React from "react";
import { View, Image, Text, StyleSheet, Pressable } from "react-native";

export interface VideoCardProps {
  thumbnail: string;          // URL ảnh hoặc require()
  views?: string;             // ví dụ: "1.5M"
  onPress?: () => void;       // sự kiện click
  borderRadius?: number;      // tùy chọn bo góc
  width?: number;             // tùy chọn kích thước
  height?: number;
  
}

const VideoCard: React.FC<VideoCardProps> = ({
  thumbnail,
  views = "0",
  onPress,
  borderRadius = 10,
  width = 120,
  height = 180,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { width, height, borderRadius },
      ]}
    >
      <Image
        source={typeof thumbnail === "string" ? { uri: thumbnail } : thumbnail}
        style={[styles.thumbnail, { borderRadius }]}
      />

      {/* overlay gradient + text */}
      <View style={styles.overlay}>
        <Text style={styles.viewsText}>▶ {views} views</Text>
      </View>
    </Pressable>
  );
};

export default VideoCard;

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  viewsText: {
    color: "#fff",
    fontSize: 12,
  },
});

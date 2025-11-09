import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";

const PINK = "#ff2d7a";

type UserCardProps = {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  // status: "following" | "follower" | "mutual" | "request";
  isFollowed: boolean;
  isFollower: boolean;
  onFollow: (id: string) => void;
  onUnfollow: (id: string) => void;
  onPress?: () => void;
};

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  displayName,
  avatar,
  isFollower,
  isFollowed,
  onFollow,
  onUnfollow,
  onPress,
}) => {
  const renderAction = () => {
    if (isFollowed) {
      return (
        <TouchableOpacity
          style={[styles.btn, styles.btnGhost]}
          onPress={() => onUnfollow(id)}
        >
          <Text style={styles.btnGhostText}>Unfollow</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary]}
        onPress={() => onFollow(id)}
      >
        <Text style={styles.btnPrimaryText}>Follow</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.name}>@{name}</Text>
          <Text style={styles.sub}>
            {isFollower && isFollowed // là bạn bè, 2 người cùng follow nhau
              ? "Friend"
              : isFollowed
              ? "You follow"
              : isFollower
              ? "Follows you"
              : "People"}
          </Text>
        </View>
      </View>
      {renderAction()}
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 12,
    paddingRight:90,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  displayName: { fontWeight: "700", fontSize: 16 },
  name: { color: "#8b97a8", fontSize: 14 },
  sub: { color: "#8b97a8", marginTop: 2 },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: PINK },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
  btnGhost: { backgroundColor: "#f6f7fb" },
  btnGhostText: { color: "#5d6a7a", fontWeight: "700" },
});

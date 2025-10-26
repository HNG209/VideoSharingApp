import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

const PINK = "#ff2d7a";

type UserCardProps = {
  id: string;
  name: string;
  displayName: string; // Thêm displayName
  avatar: string;
  status: "following" | "follower" | "mutual" | "request";
  onFollow: (id: string) => void;
};

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  displayName,
  avatar,
  status,
  onFollow,
}) => {
  const renderAction = () => {
    if (status === "following" || status === "mutual") {
      return (
        <Pressable
          style={[styles.btn, styles.btnGhost]}
          onPress={() => onFollow(id)}
        >
          <Text style={styles.btnGhostText}>Unfollow</Text>
        </Pressable>
      );
    }
    return (
      <Pressable
        style={[styles.btn, styles.btnPrimary]}
        onPress={() => onFollow(id)}
      >
        <Text style={styles.btnPrimaryText}>Follow</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.name}>@{name}</Text>
          <Text style={styles.sub}>
            {status === "mutual"
              ? "Mutual"
              : status === "following"
              ? "You follow"
              : status === "follower"
              ? "Follows you"
              : "Friend request"}
          </Text>
        </View>
      </View>
      {renderAction()}
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 12,
    paddingRight: 70,
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

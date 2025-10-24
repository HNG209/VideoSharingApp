import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

interface Props {
  onMenu?: () => void;
  onAddFriend?: () => void;
  onEditProfile?: () => void;
}

const ICON_GREY = "#8E8E93";   
const PINK = "#ff2d7a";        

const ProfileHeader: React.FC<Props> = ({ onMenu, onAddFriend, onEditProfile }) => {
  return (
    <View style={styles.container}>
      {/* left: menu + add friend */}
      <View style={styles.left}>
        <Pressable
          onPress={onMenu}
          style={styles.iconBtn}
          hitSlop={10}
          android_ripple={{ color: "#eee", borderless: true }}
        >
          <Feather name="menu" size={24} color={ICON_GREY} />
        </Pressable>
      </View>

      {/* right: edit profile */}
      <Pressable
        onPress={onEditProfile}
        style={styles.editWrap}
        hitSlop={10}
        android_ripple={{ color: "#ffe3ef" }}
      >
        <Feather name="edit-2" size={14} color={PINK} />
        <Text style={styles.editText}> Edit Profile</Text>
      </Pressable>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, 
  },
  iconBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4, 
  },
  editWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    color: PINK,
    fontWeight: "600",
    fontSize: 14,
  },
});

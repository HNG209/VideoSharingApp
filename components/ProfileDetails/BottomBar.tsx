import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export type BottomKey = "home" | "search" | "add" | "friends" | "profile";

export default function BottomBar({
  active = "home",
  onNavigate,
}: {
  active?: BottomKey;
  onNavigate?: (key: BottomKey) => void;
}) {
  const PINK = "#ff2d7a";
  const GREY = "#8E8E93";

  const Item = ({
    icon,
    label,
    keyName,
    activeKey,
  }: {
    icon: React.ReactElement;
    label: string;
    keyName: BottomKey;
    activeKey: BottomKey;
  }) => {
    const isActive = activeKey === keyName;
    const coloredIcon = React.cloneElement(icon, { color: isActive ? PINK : GREY });
    return (
      <TouchableOpacity style={styles.tab} onPress={() => onNavigate?.(keyName)} activeOpacity={0.85}>
        {coloredIcon}
        <Text style={[styles.label, { color: isActive ? PINK : GREY }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap}>
      <Item icon={<Ionicons name="home-outline" size={22} color="#999" />} label="Home" keyName="home" activeKey={active} />
      <Item icon={<Feather name="search" size={22} color="#999" />} label="Search" keyName="search" activeKey={active} />
      <TouchableOpacity onPress={() => onNavigate?.("add")} style={styles.centerBtn} activeOpacity={0.9}>
        <Ionicons name="add-circle" size={48} color={PINK} />
      </TouchableOpacity>
      <Item icon={<Ionicons name="people-outline" size={22} color="#999" />} label="Friends" keyName="friends" activeKey={active} />
      <Item icon={<Ionicons name="person-outline" size={22} color="#999" />} label="My profile" keyName="profile" activeKey={active} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    height: 84,
    paddingBottom: Platform.select({ ios: 12, android: 8, default: 8 }),
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e6e6e6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 50,
  },
  tab: { alignItems: "center", justifyContent: "center", gap: 4 },
  label: { fontSize: 12, fontWeight: "500" },
  centerBtn: { alignItems: "center", justifyContent: "center" },
});

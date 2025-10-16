import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export type BottomKey = "home" | "search" | "add" | "friends" | "profile";

interface Props {
  /** Tab đang active (trừ nút add) */
  active?: Exclude<BottomKey, "add">;
  /** Callback khi bấm từng item */
  onNavigate?: (key: BottomKey) => void;
}

const PINK = "#ff2d7a";

const BottomBar: React.FC<Props> = ({ active = "profile", onNavigate }) => {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.wrapper}>
      <View style={styles.container}>
        <NavItem
          label="Home"
          active={active === "home"}
          icon={<Feather name="home" size={22} color={active === "home" ? PINK : "#5b616a"} />}
          onPress={() => onNavigate?.("home")}
        />

        <NavItem
          label="Search"
          active={active === "search"}
          icon={<Feather name="search" size={22} color={active === "search" ? PINK : "#5b616a"} />}
          onPress={() => onNavigate?.("search")}
        />

        <Pressable style={styles.addBtn} onPress={() => onNavigate?.("add")}>
          <Feather name="plus-circle" size={48} color={PINK} />
        </Pressable>

        <NavItem
          label="Friends"
          active={active === "friends"}
          icon={<Feather name="users" size={22} color={active === "friends" ? PINK : "#5b616a"} />}
          onPress={() => onNavigate?.("friends")}
        />

        <NavItem
          label="My profile"
          active={active === "profile"}
          icon={<Ionicons name="person-circle-outline" size={26} color={active === "profile" ? PINK : "#5b616a"} />}
          onPress={() => onNavigate?.("profile")}
        />
      </View>
    </SafeAreaView>
  );
};

export default BottomBar;

function NavItem({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      {icon}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ececec",
    // shadow/elevation
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  container: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
  item: { alignItems: "center", justifyContent: "center" },
  label: { fontSize: 12, color: "#5b616a", marginTop: 2 },
  labelActive: { color: PINK, fontWeight: "600" },
  addBtn: { alignItems: "center", justifyContent: "center" },
});

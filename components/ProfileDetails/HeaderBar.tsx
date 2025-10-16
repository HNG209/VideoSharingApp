// ─ HeaderBar (nút back, bell, more)
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

type Side = "left" | "right";
export type HeaderAction =
  | { side: Side; icon: React.ReactNode; onPress?: () => void; key: string };

interface Props {
  actions: HeaderAction[]; 
  topPadding?: number;
}

export default function HeaderBar({ actions, topPadding = 10 }: Props) {
  const left = actions.filter(a => a.side === "left");
  const right = actions.filter(a => a.side === "right");
  // return (
  //   <View style={[styles.row, { paddingTop: topPadding }]}>
  //     <View style={styles.group}>
  //       {left.map(a => (
  //         <Pressable key={a.key} onPress={a.onPress} style={styles.btn}>{a.icon}</Pressable>
  //       ))}
  //     </View>
  //     <View style={styles.group}>
  //       {right.map(a => (
  //         <Pressable key={a.key} onPress={a.onPress} style={styles.btn}>{a.icon}</Pressable>
  //       ))}
  //     </View>
  //   </View>
  // );
  return (
  <View style={[styles.row, { paddingTop: topPadding }]}>
    <View style={[styles.group, { transform: [{ translateY: 20 }] }]}>
      {left.map(a => (
        <Pressable key={a.key} onPress={a.onPress} style={styles.btn}>
          {a.icon}
        </Pressable>
      ))}
    </View>

    <View style={[styles.group, { transform: [{ translateY: 20 }] }]}>
      {right.map(a => (
        <Pressable key={a.key} onPress={a.onPress} style={styles.btn}>
          {a.icon}
        </Pressable>
      ))}
    </View>
  </View>
);

}

export const HIcons = 
{
  menu: (color="#8E8E93") => <Feather name="menu" size={24} color={color} />,
  addUser: (color="#8E8E93") => <Ionicons name="person-add-outline" size={22} color={color} />,
  back: (color="#2d2d2d") => <Feather name="chevron-left" size={26} color={color} />,
  bell: (color="#2d2d2d") => <Ionicons name="notifications-outline" size={22} color={color} />,
  more: (color="#2d2d2d") => <Feather name="more-horizontal" size={22} color={color} />,
};

const styles = StyleSheet.create({
  row: {
    height: 48, paddingHorizontal: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  group: { flexDirection: "row", alignItems: "center", gap: 16 },
  btn: { padding: 6 },
});

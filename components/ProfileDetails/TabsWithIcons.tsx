// TabsWithIcons (Videos / Liked)
import React, { ReactElement } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const PINK = "#ff2d7a", GREY = "#8E8E93";

export type TabItem = { key: string; title: string; icon: (active:boolean)=>ReactElement };
interface Props {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function TabsWithIcons({ tabs, activeKey, onChange }: Props) {
  return (
    <View style={styles.row}>
      {tabs.map(t => {
        const active = t.key === activeKey;
        return (
          <Pressable key={t.key} onPress={() => onChange(t.key)} style={[styles.tab, active && styles.active]}>
            <View style={styles.content}>
              {t.icon(active)}
              <Text style={[styles.text, active && styles.textActive]}>{t.title}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 28, marginTop: 10 },
  tab: { paddingVertical: 8 },
  active: { borderBottomWidth: 2, borderBottomColor: PINK },
  content: { flexDirection: "row", alignItems: "center", gap: 6 },
  text: { color: "#7a7a7a", fontWeight: "600" },
  textActive: { color: PINK },
});

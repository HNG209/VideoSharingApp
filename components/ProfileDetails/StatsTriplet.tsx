// StatsTriplet (3 thống kê)
import React from "react";
import { View, Text } from "react-native";

export default function StatsTriplet(props: { items: {num: string; label: string}[] }) {
  return (
    <View style={{ marginTop: 10, width: "70%", flexDirection: "row", justifyContent: "space-between" }}>
      {props.items.map(it => (
        <View key={it.label} style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>{it.num}</Text>
          <Text style={{ color: "#8b8b8b" }}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

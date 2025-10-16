// SuggestCard (danh sách gợi ý)
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

const BLUE = "#1d8cf8";

export type Suggest = { id: string; name: string; avatar: string };
export default function SuggestCard({ item, onClose, onFollow }: {
  item: Suggest; onClose?: ()=>void; onFollow?: ()=>void;
}) {
  return (
    <View style={s.card}>
      <Pressable onPress={onClose} style={s.closeBtn}><Feather name="x" size={14} color="#9aa0a6" /></Pressable>
      <Image source={{ uri: item.avatar }} style={s.avatar} />
      <Text style={s.name} numberOfLines={1}>{item.name}</Text>
      <Pressable onPress={onFollow} style={s.followBtn}><Text style={s.followText}>Follow</Text></Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: { width:120, backgroundColor:"#fff", borderRadius:14, paddingVertical:12, alignItems:"center", borderWidth:1, borderColor:"#eee" },
  closeBtn:{ position:"absolute", top:8, right:8, padding:6 },
  avatar:{ width:60, height:60, borderRadius:30, marginBottom:8 },
  name:{ fontWeight:"700", marginBottom:8 },
  followBtn:{ backgroundColor:BLUE, paddingHorizontal:16, height:28, borderRadius:8, alignItems:"center", justifyContent:"center" },
  followText:{ color:"#fff", fontWeight:"700", fontSize:12 },
});

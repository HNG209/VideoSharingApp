import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = Partial<NativeStackScreenProps<AppStackParamList, "Friends">>;

const PINK = "#ff2d7a";
const GREY = "#8E8E93";

type Friend = {
  id: string;
  name: string;
  avatar: string;
  status: "following" | "follower" | "mutual" | "request";
};

const TABS = ["All", "Following", "Followers", "Requests"] as const;
type TabKey = (typeof TABS)[number];

const FriendsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("All");

  const data = useMemo<Friend[]>(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: `f${i + 1}`,
        name: [
          "Laura",
          "Liz",
          "Daniel",
          "Cris",
          "Lina",
          "Adam",
          "Peter",
          "Rose",
        ][i % 8],
        avatar: `https://i.pravatar.cc/100?img=${i + 10}`,
        status: ["following", "follower", "mutual", "request"][
          i % 4
        ] as Friend["status"],
      })),
    []
  );

  const filtered = data.filter((d) => {
    const passTab =
      tab === "All"
        ? true
        : tab === "Following"
        ? d.status === "following" || d.status === "mutual"
        : tab === "Followers"
        ? d.status === "follower" || d.status === "mutual"
        : d.status === "request";
    const passQuery = d.name.toLowerCase().includes(query.toLowerCase());
    return passTab && passQuery;
  });

  const renderAction = (f: Friend) => {
    if (f.status === "request") {
      return (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable style={[styles.btn, styles.btnPrimary]}>
            <Text style={styles.btnPrimaryText}>Accept</Text>
          </Pressable>
        </View>
      );
    }
    if (f.status === "following" || f.status === "mutual") {
      return (
        <Pressable style={[styles.btn, styles.btnGhost]}>
          <Text style={styles.btnGhostText}>Unfollow</Text>
        </Pressable>
      );
    }
    return (
      <Pressable style={[styles.btn, styles.btnPrimary]}>
        <Text style={styles.btnPrimaryText}>Follow</Text>
      </Pressable>
    );
  };

  const renderItem = ({ item }: { item: Friend }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sub}>
            {item.status === "mutual"
              ? "Mutual"
              : item.status === "following"
              ? "You follow"
              : item.status === "follower"
              ? "Follows you"
              : "Friend request"}
          </Text>
        </View>
      </View>
      {renderAction(item)}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={GREY} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search friends"
            placeholderTextColor="#B0B0B0"
            style={styles.input}
            returnKeyType="search"
          />
        </View>
        <Pressable style={styles.iconBtn}>
          <Feather name="user-plus" size={18} color={GREY} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabItem, active && styles.tabActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          padding: 16,
          paddingBottom: 96,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  // search
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f4f5f7",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, color: "#222" },
  iconBtn: {
    width: 34,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f4f5f7",
    alignItems: "center",
    justifyContent: "center",
  },

  // tabs
  tabs: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#f6f6f8",
  },
  tabActive: { backgroundColor: PINK },
  tabText: { fontWeight: "700", color: "#7a7a7d" },
  tabTextActive: { color: "#fff" },

  // list item
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
  name: { fontWeight: "700", fontSize: 16 },
  sub: { color: "#8b97a8", marginTop: 2 },

  // buttons
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

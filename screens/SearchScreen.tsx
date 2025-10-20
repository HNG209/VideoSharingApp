// src/screens/SearchScreen.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";
import BottomBar, { BottomKey } from "../components/ProfileDetails/BottomBar";

type Props = Partial<NativeStackScreenProps<AppStackParamList, "Search">>;

const PINK = "#ff2d7a";
const GREY = "#8E8E93";
const { width } = Dimensions.get("window");

type Card = {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  image: string;
  views: string;
  likes: string;
  badge?: string;
};

const TABS = ["Trending", "Accounts", "Streaming", "Audio"] as const;
type TabKey = (typeof TABS)[number];

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  // ---- state tìm kiếm + tab ----
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("Trending");

  // indicator cho tab
  const xVals = useRef<number[]>(new Array(TABS.length).fill(0)).current;
  const wVals = useRef<number[]>(new Array(TABS.length).fill(0)).current;
  const indX = useRef(new Animated.Value(0)).current;
  const indW = useRef(new Animated.Value(0)).current;

  const moveIndicator = (idx: number) => {
    Animated.parallel([
      Animated.timing(indX, { toValue: xVals[idx], duration: 160, useNativeDriver: false }),
      Animated.timing(indW, { toValue: wVals[idx], duration: 160, useNativeDriver: false }),
    ]).start();
  };

  const onPressTab = (key: TabKey, idx: number) => {
    setActiveTab(key);
    moveIndicator(idx);
  };
  const cards: Card[] = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: `c${i + 1}`,
        title: [
          "Eiusmod Lorem aliquip exercitation",
          "Reprehenderit ad fugiat nulla mollit",
          "Consectetur est aliquip adipisicing",
          "Aute adipisicing ea in nostrud sunt",
        ][i % 4],
        author: ["Laura", "Liz", "Cris", "Lina"][i % 4],
        authorAvatar: `https://i.pravatar.cc/100?img=${20 + i}`,
        image: `https://picsum.photos/seed/pet${i + 1}/700/900`,
        views: `${(Math.random() * 1.5 + 0.8).toFixed(1)}M views`,
        likes: `${(Math.random() * 35 + 10).toFixed(1)}K`,
        badge: i % 3 === 0 ? "1 min ago" : undefined,
      })),
    []
  );

  const chips = useMemo(
    () => [
      "Funny momments of pet",
      "Cats",
      "Dogs",
      "Foods for pet",
      "Vet center",
    ],
    []
  );

  // ---- điều hướng bottom ----
  const onBottomNavigate = (key: BottomKey) => {
    if (key === "add") {
      navigation?.navigate?.("CreateVideo" as any);
      return;
    }
    switch (key) {
      case "home":
        navigation?.navigate?.("Home" as any);
        break;
      case "search":
        navigation?.navigate?.("Search" as any);
        break;
      case "friends":
        navigation?.navigate?.("Friends" as any);
        break;
      case "profile":
        navigation?.navigate?.("MyProfile" as any);
        break;
    }
  };

  // ---- render item ----
  const CARD_W = (width - 16 * 2 - 12) / 2; // padding 16, gap 12
  const renderCard = ({ item }: { item: Card }) => (
    <Pressable
      onPress={() => navigation?.navigate?.("ProfileDetails" as any, { id: item.id })}
      style={[styles.card, { width: CARD_W }]}
    >
      <View style={styles.posterWrap}>
        <Image source={{ uri: item.image }} style={styles.poster} />
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        <View style={styles.metrics}>
          <View style={styles.metricRow}>
            <Feather name="play" size={12} color="#fff" />
            <Text style={styles.metricText}>{item.views}</Text>
          </View>
          <View style={styles.metricRow}>
            <Feather name="heart" size={12} color="#fff" />
            <Text style={styles.metricText}>{item.likes}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.authorRow}>
        <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
        <Text style={styles.authorName}>{item.author}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color={GREY} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor="#B0B0B0"
              style={styles.input}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={18} color="#C8C8CD" />
              </Pressable>
            )}
          </View>
          <Pressable style={styles.filterBtn} onPress={() => {}}>
            <Feather name="sliders" size={18} color={GREY} />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrap}>
          <View style={styles.tabsRow}>
            {TABS.map((t, i) => {
              const active = t === activeTab;
              return (
                <Pressable
                  key={t}
                  style={[styles.tabItem, active && styles.tabActive]}
                  onLayout={(e) => {
                    xVals[i] = e.nativeEvent.layout.x;
                    wVals[i] = e.nativeEvent.layout.width;
                    if (active) {
                      indX.setValue(xVals[i]);
                      indW.setValue(wVals[i]);
                    }
                  }}
                  onPress={() => onPressTab(t, i)}
                >
                  <Text style={[styles.tabText, active && { color: "#fff" }]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* indicator dạng pill hồng */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.indicator,
              {
                transform: [{ translateX: indX }],
                width: indW,
              },
            ]}
          />
        </View>

        {/* Grid 2 cột */}
        <FlatList
          data={cards}
          keyExtractor={(it) => it.id}
          renderItem={renderCard}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        />

        {/* Show more */}
        <Pressable style={styles.showMore} onPress={() => {}}>
          <Text style={{ color: PINK, fontWeight: "600" }}>Show more</Text>
          <Ionicons name="chevron-down" size={16} color={PINK} />
        </Pressable>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Chips gợi ý */}
        <Text style={styles.suggestTitle}>Maybe you're interested</Text>
        <View style={styles.chipsWrap}>
          {chips.map((c) => (
            <Pressable key={c} style={styles.chip} onPress={() => setQuery(c)}>
              <Text style={styles.chipText}>{c}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomBar active="search" onNavigate={onBottomNavigate} />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  // container: { flex: 1, backgroundColor: "#fff" },
  container: {
  flex: 1,
  backgroundColor: "#fff",
  paddingTop: 36, // 👈 chỉnh cao bao nhiêu tuỳ bạn (20–40)
},


  // search
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 14,
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f4f5f7",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, color: "#222" },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f4f5f7",
    alignItems: "center",
    justifyContent: "center",
  },

  // tabs
  tabsWrap: { marginTop: 16, paddingHorizontal: 16, position: "relative" },
  tabsRow: { flexDirection: "row", gap: 10 },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#f6f6f8",
     marginBottom: 15,
  },
  tabActive: { backgroundColor: PINK },
  tabText: { fontWeight: "700", color: "#7a7a7d" },
  indicator: {
    position: "absolute",
    height: 36,
    borderRadius: 18,
    backgroundColor: PINK,
    left: 16,
    top: 0,
    opacity: 0.18, 
  },

  // card
  card: {
    borderRadius: 10,
  },
  posterWrap: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  poster: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: PINK,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  metrics: {
    position: "absolute",
    right: 8,
    bottom: 8,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metricText: { color: "#fff", fontSize: 12 },

  cardTitle: { marginTop: 8, fontWeight: "700", color: "#222" },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  authorAvatar: { width: 20, height: 20, borderRadius: 10 },
  authorName: { color: "#666" },

  // show more
  showMore: {
    alignSelf: "center",
    marginTop: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    padding: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginTop: 8,
    marginHorizontal: 16,
  },

  // chips
  suggestTitle: { marginTop: 16, marginHorizontal: 16, fontWeight: "800", fontSize: 16 },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f6f7fb",
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { color: "#5d6a7a", fontWeight: "600" },
});

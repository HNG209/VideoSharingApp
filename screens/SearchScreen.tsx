// src/screens/SearchScreen.tsx
import React, { memo, useMemo, useRef, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = Partial<NativeStackScreenProps<AppStackParamList, "Search">>;

const PINK = "#ff2d7a";
const GREY = "#8E8E93";
const { width } = Dimensions.get("window");

const TABS = ["Trending", "Accounts", "Streaming", "Audio"] as const;
type TabKey = (typeof TABS)[number];

/* =======================
   Sub Components
======================= */

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
const CARD_W = (width - 16 * 2 - 12) / 2;

const TrendingGrid = memo(function TrendingGrid({
  data,
  onPressCard,
}: {
  data: Card[];
  onPressCard: (id: string) => void;
}) {
  const renderItem = ({ item }: { item: Card }) => (
    <Pressable
      onPress={() => onPressCard(item.id)}
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
        <Image
          source={{ uri: item.authorAvatar }}
          style={styles.authorAvatar}
        />
        <Text style={styles.authorName}>{item.author}</Text>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
    />
  );
});

type Account = {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  following?: boolean;
};
const AccountsList = memo(function AccountsList({ data }: { data: Account[] }) {
  const renderItem = ({ item }: { item: Account }) => (
    <View style={styles.accRow}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Image source={{ uri: item.avatar }} style={styles.accAvatar} />
        <View>
          <Text style={styles.accName}>{item.name}</Text>
          <Text style={styles.accSub}>{item.followers} followers</Text>
        </View>
      </View>
      <Pressable
        style={[
          styles.btn,
          item.following ? styles.btnGhost : styles.btnPrimary,
        ]}
      >
        <Text
          style={item.following ? styles.btnGhostText : styles.btnPrimaryText}
        >
          {item.following ? "Following" : "Follow"}
        </Text>
      </Pressable>
    </View>
  );
  return (
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      scrollEnabled={false}
    />
  );
});

type Live = { id: string; title: string; thumbnail: string; viewers: string };
const StreamingGrid = memo(function StreamingGrid({ data }: { data: Live[] }) {
  const renderItem = ({ item }: { item: Live }) => (
    <View style={[styles.card, { width: CARD_W }]}>
      <View style={styles.posterWrap}>
        <Image source={{ uri: item.thumbnail }} style={styles.poster} />
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={[styles.metrics, { left: 8, right: undefined }]}>
          <View style={styles.metricRow}>
            <Feather name="eye" size={12} color="#fff" />
            <Text style={styles.metricText}>{item.viewers}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
    />
  );
});

type Track = { id: string; title: string; author: string; duration: string };
const AudioList = memo(function AudioList({ data }: { data: Track[] }) {
  const renderItem = ({ item }: { item: Track }) => (
    <View style={styles.trackRow}>
      <View style={styles.trackLeft}>
        <View style={styles.trackThumb}>
          <Feather name="music" size={16} color="#fff" />
        </View>
        <View>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackSub} numberOfLines={1}>
            {item.author} · {item.duration}
          </Text>
        </View>
      </View>
      <Pressable style={styles.playBtn}>
        <Feather name="play" size={16} color={PINK} />
      </Pressable>
    </View>
  );
  return (
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      scrollEnabled={false}
    />
  );
});

/* =======================
   Main Screen
======================= */

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("Trending");
  const insets = useSafeAreaInsets();

  // indicator for tabs
  const xVals = useRef<number[]>(new Array(TABS.length).fill(0)).current;
  const wVals = useRef<number[]>(new Array(TABS.length).fill(0)).current;
  const indX = useRef(new Animated.Value(0)).current;
  const indW = useRef(new Animated.Value(0)).current;

  const moveIndicator = (idx: number) => {
    Animated.parallel([
      Animated.timing(indX, {
        toValue: xVals[idx],
        duration: 160,
        useNativeDriver: false,
      }),
      Animated.timing(indW, {
        toValue: wVals[idx],
        duration: 160,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onPressTab = (key: TabKey, idx: number) => {
    setActiveTab(key);
    moveIndicator(idx);
  };

  // mock data
  const cards: Card[] = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: `c${i + 1}`,
        title: [
          "Eiusmod Lorem",
          "Reprehenderit mollit",
          "Consectetur aliquip",
          "Aute in nostrud",
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

  const accounts: Account[] = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: `a${i + 1}`,
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
        avatar: `https://i.pravatar.cc/100?img=${i + 5}`,
        followers: `${(Math.random() * 500 + 20).toFixed(1)}k`,
        following: Math.random() > 0.6,
      })),
    []
  );

  const lives: Live[] = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: `l${i + 1}`,
        title: ["Morning walk", "Beach live", "Play with cats", "Cute puppy"][
          i % 4
        ],
        thumbnail: `https://picsum.photos/seed/live${i + 1}/700/900`,
        viewers: `${(Math.random() * 8 + 1).toFixed(1)}k watching`,
      })),
    []
  );

  const tracks: Track[] = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: `t${i + 1}`,
        title: ["Sunny Day", "Cat Dance", "Bark Beat", "Ocean Loop"][i % 4],
        author: ["@audiohub", "@popmix", "@soundlab", "@beatbox"][i % 4],
        duration: `0${Math.floor(Math.random() * 3) + 1}:${(
          Math.floor(Math.random() * 50) + 10
        )
          .toString()
          .padStart(2, "0")}`,
      })),
    []
  );

  const filteredCards = cards.filter((c) =>
    `${c.title} ${c.author}`.toLowerCase().includes(query.toLowerCase())
  );
  const filteredAccounts = accounts.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredLives = lives.filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase())
  );
  const filteredTracks = tracks.filter((t) =>
    `${t.title} ${t.author}`.toLowerCase().includes(query.toLowerCase())
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
          <Pressable style={styles.filterBtn}>
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
                  <Text style={[styles.tabText, active && { color: "#fff" }]}>
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>
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

        {/* CONTENT: hiển thị component theo tab */}
        {activeTab === "Trending" && (
          <TrendingGrid
            data={filteredCards}
            onPressCard={(id) =>
              navigation?.navigate?.("ProfileDetails" as any, { id })
            }
          />
        )}
        {activeTab === "Accounts" && <AccountsList data={filteredAccounts} />}
        {activeTab === "Streaming" && <StreamingGrid data={filteredLives} />}
        {activeTab === "Audio" && <AudioList data={filteredTracks} />}

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
    </View>
  );
};

export default SearchScreen;

/* =======================
   Styles
======================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // search
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
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
  tabsWrap: {
    marginTop: 16,
    paddingHorizontal: 16,
    position: "relative",
    marginBottom: 12,
  },
  tabsRow: { flexDirection: "row", gap: 10 },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#f6f6f8",
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

  // grid/trending
  card: { borderRadius: 10 },
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
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  authorAvatar: { width: 20, height: 20, borderRadius: 10 },
  authorName: { color: "#666" },

  // accounts
  accRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accAvatar: { width: 44, height: 44, borderRadius: 22 },
  accName: { fontWeight: "700", fontSize: 16 },
  accSub: { color: "#8b97a8", marginTop: 2 },
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

  // streaming
  liveBadge: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: PINK,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  liveText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  // audio
  trackRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trackLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  trackThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  trackTitle: { fontWeight: "700", maxWidth: width * 0.55 },
  trackSub: { color: "#8b97a8", marginTop: 2, maxWidth: width * 0.55 },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#ffe6ef",
    alignItems: "center",
    justifyContent: "center",
  },

  // chips
  suggestTitle: {
    marginTop: 16,
    marginHorizontal: 16,
    fontWeight: "800",
    fontSize: 16,
  },
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

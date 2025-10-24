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
  ScrollView,
  LayoutChangeEvent,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = Partial<NativeStackScreenProps<AppStackParamList, "Search">>;

const PINK = "#ff2d7a";
const GREY = "#8E8E93";
const { width } = Dimensions.get("window");

const TABS = ["Trending", "Accounts", "Streaming", "Audio"] as const;
type TabKey = (typeof TABS)[number];

/* ----------------------
   Sub components (unchanged)
   ---------------------- */

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
        <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: item.avatar }} style={styles.accAvatar} />
        <View style={{ marginLeft: 12 }}>
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
   Main Screen (header fixed, content scrolls under)
   - Search + Tabs are both fixed (header outside ScrollView)
   - ScrollView content is padded by measured headerHeight so it does NOT appear under header
======================= */

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("Trending");
  const insets = useSafeAreaInsets();

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

  // FILTER theo ô tìm kiếm
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
    () => ["Funny momments of pet", "Cats", "Dogs", "Foods for pet", "Vet center"],
    []
  );

  // measure header height so content starts below it
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const onHeaderLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setHeaderHeight(h);
    // debug: console.log("headerHeight", h);
  };

  return (
    <View style={styles.container}>
      {/* Header fixed: placed OUTSIDE ScrollView so it NEVER scrolls */}
      <View
        style={[
          styles.headerWrap,
          { top: 0, left: 0, right: 0, paddingTop: insets.top },
        ]}
        onLayout={onHeaderLayout}
      >
        {/* Search box (fixed) */}
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
          </View>
        </View>

        {/* Tabs (fixed) */}
        <View style={styles.tabsWrap}>
          <View style={styles.tabsRow}>
            {TABS.map((t) => {
              const active = t === activeTab;
              return (
                <Pressable
                  key={t}
                  style={[styles.tabItem, active && styles.tabActive]}
                  onPress={() => setActiveTab(t)}
                >
                  <Text style={[styles.tabText, active && { color: "#fff" }]}>{t}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Scrollable content: padded by headerHeight so it does not go under the fixed header */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight || 160, // fallback until measured
          paddingBottom: 96,
        }}
        showsVerticalScrollIndicator={false}
      >
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

  headerWrap: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "#fff",
    // make header appear above content on Android/iOS
    ...Platform.select({
      android: { elevation: 6 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },

  // Search (fixed)
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  searchBox: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f4f5f7",
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, color: "#222" },

  // Tabs (fixed)
  tabsWrap: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabsRow: { flexDirection: "row" },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#f6f6f8",
    marginRight: 10,
  },
  tabActive: { backgroundColor: PINK },
  tabText: { fontWeight: "700", color: "#7a7a7d" },

  // Cards/grid
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
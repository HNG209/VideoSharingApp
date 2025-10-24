// src/screens/MyProfileScreen.tsx
import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
  Pressable,
  Animated,
  LayoutChangeEvent,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { ReactElement } from "react";
import VideoCard from "../components/VideoCard";
import BottomBar, { BottomKey } from "../components/ProfileDetails/BottomBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { DrawerActions, useNavigation } from "@react-navigation/native";

type Media = { id: string; thumbnail: string; views?: string };

const SCREEN_W = Dimensions.get("window").width;
const GUTTER = 10;
const COLS = 3;
const CARD_W = (SCREEN_W - (COLS + 1) * GUTTER) / COLS;
const BOTTOM_H = 84;

const ICON_GREY = "#8E8E93";
const PINK = "#ff2d7a";

const TAB_KEYS = ["My Videos", "My Images", "Liked"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const INDICATOR_W = 74;

export default function MyProfileScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const profile = useSelector((state: RootState) => state.auth.user);

  // ===== Mock data =====
  const videos: Media[] = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: `v${i + 1}`,
        thumbnail: `https://picsum.photos/400?random=${i + 1}`,
        views: `${(Math.random() * 8 + 1).toFixed(1)}M`,
      })),
    []
  );

  const images: Media[] = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: `i${i + 1}`,
        thumbnail: `https://picsum.photos/400?image=${i + 20}`,
        views: `${(Math.random() * 3 + 0.5).toFixed(1)}M`,
      })),
    []
  );

  const liked: Media[] = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: `l${i + 1}`,
        thumbnail: `https://picsum.photos/400?seed=${i + 50}`,
        views: `${Math.floor(Math.random() * 900 + 100)}k`,
      })),
    []
  );

  const PAGES: { key: TabKey; data: Media[] }[] = useMemo(
    () => [
      { key: "My Videos", data: videos },
      { key: "My Images", data: images },
      { key: "Liked", data: liked },
    ],
    [videos, images, liked]
  );

  const [tab, setTab] = useState<TabKey>("My Videos");
  const [refreshing, setRefreshing] = useState(false);
  const [activeBottom, setActiveBottom] =
    useState<Exclude<BottomKey, "add">>("profile");

  const scrollX = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<FlatList>(null);

  const [tabLayouts, setTabLayouts] = useState<
    Array<{ x: number; width: number }>
  >([
    { x: 0, width: INDICATOR_W },
    { x: 0, width: INDICATOR_W },
    { x: 0, width: INDICATOR_W },
  ]);

  const onTabLayout =
    (index: number) =>
    (e: LayoutChangeEvent): void => {
      const { x, width } = e.nativeEvent.layout;
      setTabLayouts((prev) => {
        const copy = [...prev];
        copy[index] = { x, width };
        return copy;
      });
    };

  const inputRange = PAGES.map((_, i) => i * SCREEN_W);
  const centers = tabLayouts.map((t) => t.x + t.width / 2);
  const fallbackCenters = [
    SCREEN_W / 2 - 120,
    SCREEN_W / 2,
    SCREEN_W / 2 + 120,
  ];
  const outputRange = centers.every((c) => c > 0)
    ? centers.map((c) => c - INDICATOR_W / 2)
    : fallbackCenters.map((c) => c - INDICATOR_W / 2);

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange,
    extrapolate: "clamp",
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const renderGridItem = ({ item }: { item: Media }) => (
    <VideoCard
      thumbnail={item.thumbnail}
      views={item.views}
      width={CARD_W}
      height={CARD_W * 1.45}
      onPress={() =>
        navigation?.navigate?.("ProfileDetails" as any, { id: item.id })
      }
    />
  );

  const onPressTab = (t: TabKey) => {
    setTab(t);
    const index = PAGES.findIndex((p) => p.key === t);
    pagerRef.current?.scrollToIndex({ index, animated: true });
  };

  // --- FIX: compute counts safely and coerce to string ---
  // Use explicit lookup order, avoid chaining that confuses TS/linters.
  const followingRaw =
    (profile && (profile.profile as any)?.followingCount) ??
    (profile && (profile as any).following) ??
    203;
  const followerRaw =
    (profile && (profile.profile as any)?.followers) ??
    (profile && (profile as any).followers) ??
    628;
  const likeRaw =
    (profile && (profile.profile as any)?.likes) ??
    (profile && (profile as any).likes) ??
    2634;

  const followingCount = String(followingRaw);
  const followerCount = String(followerRaw);
  const likeCount = String(likeRaw);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ===== Header ===== */}
      <View style={styles.headerRow}>
        <View style={styles.left}>
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}
            style={styles.iconBtn}
          >
            <Feather name="menu" size={24} color={ICON_GREY} />
          </TouchableOpacity>
        </View>

        {/* removed Edit button from top-right header to place it under profile info */}
        <View style={{ width: 44 }} />
      </View>

      {/* ===== Profile info ===== */}
      <View style={styles.headerCenter}>
        <Image
          source={{ uri: profile?.profile?.avatar }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {profile?.profile?.displayName || profile?.username || "Vinh"}
        </Text>
        <Text style={styles.username}>{"@" + (profile?.username || "Vinh")}</Text>

        {/* Move Edit Profile button here, under username */}
        <Pressable
          style={styles.editButton}
          onPress={() => navigation?.navigate?.("EditProfile")}
        >
          <Feather name="edit-2" size={14} color={PINK} />
          <Text style={styles.editButtonText}> Edit Profile</Text>
        </Pressable>

        {/* ===== Stats row (three items) - moved down and centered ===== */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{followerCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{likeCount}</Text>
            <Text style={styles.statLabel}>Like</Text>
          </View>
        </View>

        <Text style={styles.bio}>{profile?.profile?.bio}</Text>

        {/* ===== Tabs + Animated indicator =====*/}
        <View style={styles.tabsWrap}>
          <View style={styles.tabs}>
            {TAB_KEYS.map((t, i) => {
              const active = t === tab;
              let icon: ReactElement | null = null;
              if (t === "My Videos")
                icon = (
                  <Feather
                    name="play"
                    size={16}
                    color={active ? PINK : ICON_GREY}
                  />
                );
              if (t === "My Images")
                icon = (
                  <Feather
                    name="image"
                    size={16}
                    color={active ? PINK : ICON_GREY}
                  />
                );
              if (t === "Liked")
                icon = (
                  <Feather
                    name="heart"
                    size={16}
                    color={active ? PINK : ICON_GREY}
                  />
                );

              return (
                <Pressable
                  key={t}
                  onPress={() => onPressTab(t)}
                  style={[styles.tab, active && styles.tabActive]}
                  onLayout={onTabLayout(i)}
                >
                  <View style={styles.tabContent}>
                    {icon}
                    <Text
                      style={[styles.tabText, active && styles.tabTextActive]}
                    >
                      {t}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Animated.View
            style={[
              styles.indicator,
              {
                width: INDICATOR_W,
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
      </View>

      {/* ===== Pager ===== */}
      <Animated.FlatList
        ref={pagerRef}
        data={PAGES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_W,
          offset: SCREEN_W * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setTab(PAGES[index].key);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_W }}>
            <FlatList
              data={item.data}
              numColumns={COLS}
              keyExtractor={(it) => it.id}
              renderItem={renderGridItem}
              contentContainerStyle={[
                styles.listContainer,
                { paddingBottom: BOTTOM_H },
              ]}
              columnWrapperStyle={{ gap: GUTTER }}
              ItemSeparatorComponent={() => <View style={{ height: GUTTER }} />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        )}
      />
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // username
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },

  // bio
  bio: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  // header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 16 },
  iconBtn: { padding: 6 },

  // edit (moved below username)
  editButton: {
    flexDirection: "row", 
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#f0a1be10",
  },
  editButtonText: { color: PINK, fontWeight: "600", fontSize: 14 },

  headerCenter: { alignItems: "center", paddingVertical: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginVertical: 10 },
  name: { fontSize: 22, fontWeight: "800", textAlign: "center" },

  // stats row: keep three stats, moved slightly down and centered
  statsRow: {
    marginTop: 10,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
  statItem: { alignItems: "center", width: "33%" },
  statNumber: {
    fontSize: 16, 
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
  },
  statLabel: {
    marginTop: 2,
    fontSize: 13,
    color: "#8b97a8",
    textAlign: "center",
  },

  // tabs + indicator
  tabsWrap: { marginTop: 14, paddingBottom: 10 },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 16,
  },
  tab: { paddingVertical: 6 },
  tabActive: {},
  tabContent: { flexDirection: "row", alignItems: "center", gap: 6 },
  tabText: { color: "#888", fontWeight: "600" },
  tabTextActive: { color: PINK },
  indicator: {
    height: 2,
    backgroundColor: PINK,
    borderRadius: 2,
    alignSelf: "flex-start",
    marginTop: 8,
  },

  // list
  listContainer: { paddingHorizontal: GUTTER, paddingTop: 10 },
});
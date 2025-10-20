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
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { ReactElement } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";
import VideoCard from "../components/VideoCard";
import BottomBar, { BottomKey } from "../components/ProfileDetails/BottomBar";

type Props = Partial<NativeStackScreenProps<AppStackParamList, "MyProfile">>;
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

const MyProfileScreen: React.FC<Props> = ({ navigation }) => {
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
  >([{ x: 0, width: INDICATOR_W }, { x: 0, width: INDICATOR_W }, { x: 0, width: INDICATOR_W }]);

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
  const fallbackCenters = [SCREEN_W / 2 - 120, SCREEN_W / 2, SCREEN_W / 2 + 120];
  const outputRange =
    centers.every((c) => c > 0)
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
      onPress={() => navigation?.navigate?.("ProfileDetails" as any, { id: item.id })}
    />
  );

  // 👇 Điều hướng đầy đủ + giữ active
  const onBottomNavigate = (key: BottomKey) => {
  if (key === "add") {
    navigation?.navigate?.("CreateVideo" as any);
    return;
  }

  const targetKey = key as Exclude<BottomKey, "add">; // ép kiểu hợp lệ
  setActiveBottom(targetKey);

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


  const onPressTab = (t: TabKey) => {
    setTab(t);
    const index = PAGES.findIndex((p) => p.key === t);
    pagerRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.headerRow}>
        <View style={styles.left}>
          <Pressable onPress={() => {}} style={styles.iconBtn}>
            <Feather name="menu" size={24} color={ICON_GREY} />
          </Pressable>
          <Pressable onPress={() => {}} style={styles.iconBtn}>
            <Ionicons name="person-add-outline" size={22} color={ICON_GREY} />
          </Pressable>
        </View>

        <Pressable onPress={() => {}} style={styles.editWrap}>
          <Feather name="edit-2" size={14} color={PINK} />
          <Text style={styles.editText}> Edit Profile</Text>
        </Pressable>
      </View>

      {/* ===== Profile info ===== */}
      <View style={styles.headerCenter}>
        <Image source={{ uri: "https://i.pravatar.cc/200" }} style={styles.avatar} />
        <Text style={styles.name}>Ruth Sanders</Text>

        <View style={styles.statsRow}>
          <Stat number="203" label="Following" />
          <Stat number="628" label="Followers" />
          <Stat number="2634" label="Like" />
        </View>

        {/* ===== Tabs + Animated indicator ===== */}
        <View style={styles.tabsWrap}>
          <View style={styles.tabs}>
            {TAB_KEYS.map((t, i) => {
              const active = t === tab;
              let icon: ReactElement | null = null;
              if (t === "My Videos")
                icon = <Feather name="play" size={16} color={active ? PINK : ICON_GREY} />;
              if (t === "My Images")
                icon = <Feather name="image" size={16} color={active ? PINK : ICON_GREY} />;
              if (t === "Liked")
                icon = <Feather name="heart" size={16} color={active ? PINK : ICON_GREY} />;

              return (
                <Pressable
                  key={t}
                  onPress={() => onPressTab(t)}
                  style={[styles.tab, active && styles.tabActive]}
                  onLayout={onTabLayout(i)}
                >
                  <View style={styles.tabContent}>
                    {icon}
                    <Text style={[styles.tabText, active && styles.tabTextActive]}>{t}</Text>
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
              contentContainerStyle={[styles.listContainer, { paddingBottom: BOTTOM_H }]}
              columnWrapperStyle={{ gap: GUTTER }}
              ItemSeparatorComponent={() => <View style={{ height: GUTTER }} />}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
          </View>
        )}
      />

      {/* ===== Bottom Bar ===== */}
      <BottomBar active={activeBottom} onNavigate={onBottomNavigate} />
    </View>
  );
};

export default MyProfileScreen;

/* ===== Small stat component ===== */
const Stat = ({ number, label }: { number: string; label: string }) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ fontWeight: "700", fontSize: 18 }}>{number}</Text>
    <Text style={{ color: "#888" }}>{label}</Text>
  </View>
);

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 16 },
  iconBtn: { padding: 6 },
  editWrap: { flexDirection: "row", alignItems: "center" },
  editText: { color: PINK, fontWeight: "600", fontSize: 14 },

  // profile
  headerCenter: { alignItems: "center", paddingVertical: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginVertical: 10 },
  name: { fontSize: 22, fontWeight: "700" },
  statsRow: {
    marginTop: 10,
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // tabs + indicator
  tabsWrap: { marginTop: 14, paddingBottom: 10 },
  tabs: { flexDirection: "row", justifyContent: "center", gap: 24, paddingHorizontal: 16 },
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
    marginLeft: 16,
  },

  // list
  listContainer: { paddingHorizontal: GUTTER, paddingTop: 10 },
});

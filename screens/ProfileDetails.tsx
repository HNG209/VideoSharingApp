// src/screens/ProfileDetails.tsx
import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Animated,
  Pressable,
  RefreshControl,
  LayoutChangeEvent,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";

// Reuse components
import HeaderBar, { HIcons } from "../components/ProfileDetails/HeaderBar";
import StatsTriplet from "../components/ProfileDetails/StatsTriplet";
import SuggestCard, { Suggest } from "../components/ProfileDetails/SuggestCard";
import VideoCard from "../components/VideoCard";

type Props = Partial<NativeStackScreenProps<AppStackParamList, "ProfileDetails">>;
type Media = { id: string; thumbnail: string; views?: string };

const { width: SCREEN_W } = Dimensions.get("window");
const GUTTER = 10;
const COLS = 3;
const CARD_W = (SCREEN_W - (COLS + 1) * GUTTER) / COLS;

const PINK = "#ff2d7a";
const GREY = "#8E8E93";

const TAB_KEYS = ["Videos", "Liked"] as const;
type TabKey = (typeof TAB_KEYS)[number];
const INDICATOR_W = 64;

export default function ProfileDetails({ navigation }: Props) {
  // ===== mock data =====
  const videos: Media[] = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: `v${i + 1}`,
        thumbnail: `https://picsum.photos/400?random=${i + 1}`,
        views: `${(Math.random() * 3 + 1.2).toFixed(1)}M`,
      })),
    []
  );

  const liked: Media[] = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => ({
        id: `l${i + 1}`,
        thumbnail: `https://picsum.photos/400?seed=${i + 40}`,
        views: `${Math.floor(Math.random() * 900 + 100)}k`,
      })),
    []
  );

  // const suggests: Suggest[] = useMemo(
  //   () => [
  //     { id: "s1", name: "Vinh", avatar: "https://i.pravatar.cc/100?img=36" },
  //     { id: "s2", name: "Hưng", avatar: "https://i.pravatar.cc/100?img=12" },
  //     { id: "s3", name: "Tài", avatar: "https://i.pravatar.cc/100?img=7" },
  //     { id: "s4", name: "Lan", avatar: "https://i.pravatar.cc/100?img=22" },
  //     { id: "s5", name: "Minh", avatar: "https://i.pravatar.cc/100?img=45" },
  //   ],
  //   []
  // );
  const suggests: Suggest[] = useMemo(() => {
    const names = ["Vinh", "Hưng", "Tài", "Lan", "Minh", "Thảo", "Tuấn", "My", "Dũng", "Phúc"];
    const total = 10; 
    return Array.from({ length: total }).map((_, i) => ({
      id: `s${i + 1}`,
      name: names[i % names.length],
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`, // random 1–70
    }));
  }, []);

  const PAGES: { key: TabKey; data: Media[] }[] = useMemo(
    () => [
      { key: "Videos", data: videos },
      { key: "Liked", data: liked },
    ],
    [videos, liked]
  );

  // ===== state =====
  const [tab, setTab] = useState<TabKey>("Liked"); // giống hình bạn gửi
  const [refreshing, setRefreshing] = useState(false);

  // ===== pager + indicator =====
  const scrollX = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<FlatList>(null);

  // đo layout từng tab để canh indicator
  const [tabLayouts, setTabLayouts] = useState<
    Array<{ x: number; width: number }>
  >([{ x: 0, width: INDICATOR_W }, { x: 0, width: INDICATOR_W }]);

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
  const fallbackCenters = [SCREEN_W / 2 - 60, SCREEN_W / 2 + 60];
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

  const onPressTab = (t: TabKey) => {
    setTab(t);
    const index = PAGES.findIndex((p) => p.key === t);
    pagerRef.current?.scrollToIndex({ index, animated: true });
  };

  const renderGridItem = ({ item }: { item: Media }) => (
    <VideoCard
      thumbnail={item.thumbnail}
      views={item.views}
      width={CARD_W}
      height={CARD_W * 1.45}
      onPress={() => {
        // ví dụ: mở chi tiết video
        // navigation?.navigate?.("Detail" as any, { id: item.id });
      }}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <HeaderBar
        actions={[
          { side: "left", key: "back", icon: HIcons.back(), onPress: () => navigation?.goBack?.() },
          { side: "right", key: "bell", icon: HIcons.bell() },
          { side: "right", key: "more", icon: HIcons.more() },
        ]}
        topPadding={15}
      />

      <FlatList
        ListHeaderComponent={
          <>
            {/* top user block */}
            <View style={styles.top}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: "https://i.pravatar.cc/200?img=5" }} style={styles.avatar} />
              </View>
              <Text style={styles.name}>Kiran Glaucus</Text>
              <Text style={styles.bio}>I love a colorful life ❤️❤️❤️</Text>

              <StatsTriplet
                items={[
                  { num: "203", label: "Following" },
                  { num: "628", label: "Followers" },
                  { num: "2634", label: "Likes" },
                ]}
              />

              <View style={styles.actions}>
                <View style={[styles.btn, { backgroundColor: PINK }]}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Follow</Text>
                </View>
                <View style={[styles.btn, { backgroundColor: "#ffe6ef" }]}>
                  <Text style={{ color: PINK, fontWeight: "700" }}>Message</Text>
                </View>
              </View>

              {/* suggested accounts */}
              <View style={styles.suggestHeader}>
                <Text style={{ fontWeight: "700" }}>Suggested accounts</Text>
                <Pressable hitSlop={8} onPress={() => {}}>
                  <Text style={{ color: PINK, fontWeight: "600" }}>View more</Text>
                </Pressable>
              </View>

              <FlatList
                data={suggests}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                  <SuggestCard item={item} onClose={() => {}} onFollow={() => {}} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
                style={{ marginBottom: 8 }}
              />

              {/* tabs with icons + animated indicator */}
              <View style={styles.tabsWrap}>
                <View style={styles.tabs}>
                  {TAB_KEYS.map((t, i) => {
                    const active = t === tab;
                    const icon =
                      t === "Videos" ? (
                        <Feather name="play" size={16} color={active ? PINK : GREY} />
                      ) : (
                        <Feather name="heart" size={16} color={active ? PINK : GREY} />
                      );
                    return (
                      <Pressable
                        key={t}
                        onPress={() => onPressTab(t)}
                        style={styles.tab}
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
                    { width: INDICATOR_W, transform: [{ translateX }] },
                  ]}
                />
              </View>
            </View>
          </>
        }
        data={[0]} 
        keyExtractor={() => "pager"}
        renderItem={() => (
          <Animated.FlatList
            ref={pagerRef}
            data={PAGES}
            keyExtractor={(i) => i.key}
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
                  contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: 24 }}
                  columnWrapperStyle={{ gap: GUTTER }}
                  ItemSeparatorComponent={() => <View style={{ height: GUTTER }} />}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                />
              </View>
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    paddingBottom: 6,
    paddingHorizontal: 16,
    alignItems: "center",       
  },
  avatarWrap: {
    width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderColor: PINK,
    alignSelf: "center", alignItems: "center", justifyContent: "center", marginTop: 4,
  },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  name: { fontSize: 20, fontWeight: "800", textAlign: "center", marginTop: 8 },
  bio: { color: "#666", textAlign: "center", marginTop: 4 },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
    width: "100%",               
    justifyContent: "center",     
    alignItems: "center",
  },
  
  btn: {
  height: 36,
  minWidth: 120,                
  paddingHorizontal: 22,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
},


  suggestHeader: {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  marginTop: 18,
},


  tabsWrap: { marginTop: 10, paddingBottom: 10 },
  tabs: { flexDirection: "row", justifyContent: "center", gap: 28, paddingHorizontal: 16 },
  tab: { paddingVertical: 6 },
  tabContent: { flexDirection: "row", alignItems: "center", gap: 6 },
  tabText: { color: "#7a7a7a", fontWeight: "600" },
  tabTextActive: { color: PINK },
  indicator: {
    height: 2, backgroundColor: PINK, borderRadius: 2,
    marginTop: 6, marginLeft: 16,
  },
});

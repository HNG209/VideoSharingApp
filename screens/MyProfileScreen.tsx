import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchUserPost } from "../store/slices/user.post.slice";
import { Post } from "../types/post";
import VideoCard from "../components/VideoCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../types/navigation";

const SCREEN_W = Dimensions.get("window").width;
const GUTTER = 10;
const COLS = 3;
const CARD_W = (SCREEN_W - (COLS + 1) * GUTTER) / COLS;
const INDICATOR_W = 74;
const PINK = "#ff2d7a";
const ICON_GREY = "#8E8E93";

const TAB_KEYS = ["My Videos", "My Images", "Liked"] as const;
type TabKey = (typeof TAB_KEYS)[number];

type Props = Partial<NativeStackScreenProps<ProfileStackParamList, "Profile">>;

const MyProfileScreen: React.FC<Props> = ({ navigation }) => {
  const nav2 = navigation?.getParent()?.getParent()?.getParent();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.userPost.posts);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<TabKey>("My Videos");

  // Scroll animation
  const scrollX = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<FlatList>(null);
  const [tabLayouts, setTabLayouts] = useState(
    TAB_KEYS.map(() => ({ x: 0, width: INDICATOR_W }))
  );

  useEffect(() => {
    dispatch(fetchUserPost());
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchUserPost()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const onTabLayout =
    (index: number) =>
    (e: LayoutChangeEvent): void => {
      const { x, width } = e.nativeEvent.layout;
      setTabLayouts((prev) => {
        const next = [...prev];
        next[index] = { x, width };
        return next;
      });
    };

  // === indicator animation ===
  const inputRange = TAB_KEYS.map((_, i) => i * SCREEN_W);
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

  // === handle tab click ===
  const onPressTab = (t: TabKey) => {
    setTab(t);
    const index = TAB_KEYS.indexOf(t);
    pagerRef.current?.scrollToIndex({ index, animated: true });
  };

  // === Mock data (you can replace later with API data per tab) ===
  const videos = useMemo(() => posts, [posts]);
  const images = useMemo(() => posts, [posts]);
  const liked = useMemo(() => posts, [posts]);

  const PAGES = [
    { key: "My Videos", data: videos },
    { key: "My Images", data: images },
    { key: "Liked", data: liked },
  ] as const;

  const renderGridItem = ({ item }: { item: Post }) => (
    <VideoCard
      post={item}
      onPress={() => {
        nav2?.navigate("VideoFeed", { initialPost: item });
      }}
      width={CARD_W}
      height={CARD_W * 1.45}
    />
  );

  return (
    <View style={styles.container}>
      {/* Profile info */}
      <View style={styles.headerCenter}>
        <Image
          source={{ uri: profile?.profile?.avatar }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {profile?.profile?.displayName || profile?.username}
        </Text>
        <Text style={styles.username}>@{profile?.username}</Text>

        <Pressable
          style={styles.editButton}
          onPress={() => navigation?.navigate("EditProfile")}
        >
          <Feather name="edit-2" size={14} color={PINK} />
          <Text style={styles.editButtonText}> Edit Profile</Text>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {profile?.followingCount ?? 0}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.followerCount ?? 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.likeCount ?? 0}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {profile?.profile?.bio && (
          <Text style={styles.bio}>{profile.profile.bio}</Text>
        )}

        {/* === Tabs === */}
        <View style={styles.tabsWrap}>
          <View style={styles.tabs}>
            {TAB_KEYS.map((t, i) => {
              const active = t === tab;
              const iconName =
                t === "My Videos"
                  ? "play"
                  : t === "My Images"
                  ? "image"
                  : "heart";
              return (
                <Pressable
                  key={t}
                  onPress={() => onPressTab(t)}
                  onLayout={onTabLayout(i)}
                  style={[styles.tab, active && styles.tabActive]}
                >
                  <View style={styles.tabContent}>
                    <Feather
                      name={iconName}
                      size={16}
                      color={active ? PINK : ICON_GREY}
                    />
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
            style={[styles.indicator, { transform: [{ translateX }] }]}
          />
        </View>
      </View>

      {/* === Pager (3 pages horizontally) === */}
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
              keyExtractor={(it) => it._id}
              renderItem={renderGridItem}
              contentContainerStyle={{
                paddingHorizontal: GUTTER,
                paddingVertical: 10,
              }}
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
};

export default MyProfileScreen;

/* === Styles === */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerCenter: { alignItems: "center", paddingVertical: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginVertical: 10 },
  name: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  username: { fontSize: 14, fontWeight: "600", color: "#666" },
  bio: { marginTop: 8, fontSize: 14, color: "#666", textAlign: "center" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#f0a1be",
  },
  editButtonText: { color: PINK, fontWeight: "600", fontSize: 14 },
  statsRow: {
    marginTop: 10,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: { alignItems: "center", width: "33%" },
  statNumber: { fontSize: 16, fontWeight: "800" },
  statLabel: { color: "#8b97a8", fontSize: 13 },
  tabsWrap: { marginTop: 14, paddingBottom: 10 },
  tabs: { flexDirection: "row", justifyContent: "center", gap: 24 },
  tab: { paddingVertical: 6 },
  tabActive: {},
  tabContent: { flexDirection: "row", alignItems: "center", gap: 6 },
  tabText: { color: "#888", fontWeight: "600" },
  tabTextActive: { color: PINK },
  indicator: {
    height: 2,
    backgroundColor: PINK,
    borderRadius: 2,
    marginTop: 8,
    width: INDICATOR_W,
    alignSelf: "flex-start",
  },
});

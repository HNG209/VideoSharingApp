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
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchOtherUserPost } from "../store/slices/other.post.slice";
import { fetchOtherUserProfile } from "../store/slices/other.profile.slice";
import { Post } from "../types/post";
import VideoCard from "../components/VideoCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { followUser, unfollowUser } from "../store/slices/follow.slice";
import { RootStackParamList } from "../types/navigation";

const SCREEN_W = Dimensions.get("window").width;
const GUTTER = 10;
const COLS = 3;
const CARD_W = (SCREEN_W - (COLS + 1) * GUTTER) / COLS;
const INDICATOR_W = 74;
const PINK = "#ff2d7a";
const ICON_GREY = "#8E8E93";

const TAB_KEYS = ["Videos", "Images", "Liked"] as const;
type TabKey = (typeof TAB_KEYS)[number];

type Props = Partial<
  NativeStackScreenProps<RootStackParamList, "OtherProfile">
>;

const OtherProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const userId = route?.params?.userId;
  const otherProfile = useSelector(
    (state: RootState) => state.otherProfile.user
  );
  const posts = useSelector((state: RootState) => state.otherUserPost.posts);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<TabKey>("Videos");
  const [isFollowing, setIsFollowing] = useState(false);
  const followAnim = useRef(new Animated.Value(1)).current;

  // Scroll animation
  const scrollX = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<FlatList>(null);
  const [tabLayouts, setTabLayouts] = useState(
    TAB_KEYS.map(() => ({ x: 0, width: INDICATOR_W }))
  );

  useEffect(() => {
    if (otherProfile) {
      setIsFollowing(otherProfile.isFollowed);
    }
  }, [otherProfile]);

  useEffect(() => {
    dispatch(fetchOtherUserPost(userId!));
    dispatch(fetchOtherUserProfile(userId!));
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchOtherUserPost(userId!)).finally(() => setRefreshing(false));
  }, [dispatch, userId]);

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

  // === Mock data (bạn có thể thay bằng API data từng tab) ===
  const videos = useMemo(() => posts, [posts]);
  const images = useMemo(() => posts, [posts]);
  const liked = useMemo(() => posts, [posts]);

  const PAGES = [
    { key: "Videos", data: videos },
    { key: "Images", data: images },
    { key: "Liked", data: liked },
  ] as const;

  const renderGridItem = ({ item }: { item: Post }) => (
    <VideoCard
      post={item}
      onPress={() => {
        navigation?.navigate("VideoFeed", {
          initialPost: item,
          feedType: "other",
        });
      }}
      width={CARD_W}
      height={CARD_W * 1.45}
    />
  );

  // Hiệu ứng transition cho nút follow
  const handleFollow = useCallback(() => {
    Animated.sequence([
      Animated.timing(followAnim, {
        toValue: 0.8,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(followAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsFollowing((prev) => !prev);
      console.log(isFollowing);
      if (isFollowing) {
        dispatch(unfollowUser(userId!));
      } else {
        dispatch(followUser(userId!));
      }
      // TODO: callback xử lý follow/unfollow ở đây
    });
  }, [isFollowing, dispatch]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      {/* Nút trở về */}
      <Pressable style={[styles.backBtn]} onPress={() => navigation?.goBack()}>
        <Feather name="arrow-left" size={24} color="#222" />
      </Pressable>

      {/* Profile info */}
      <View style={styles.headerCenter}>
        <Image
          source={{ uri: otherProfile?.profile?.avatar }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {otherProfile?.profile?.displayName || otherProfile?.username}
        </Text>
        <Text style={styles.username}>@{otherProfile?.username}</Text>

        {/* Nút Follow và Tin nhắn */}
        <View style={styles.actionRow}>
          <Animated.View style={{ transform: [{ scale: followAnim }] }}>
            <Pressable
              style={[
                styles.followButton,
                isFollowing && {
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: PINK,
                },
              ]}
              onPress={handleFollow}
            >
              <Feather
                name={isFollowing ? "user-check" : "user-plus"}
                size={16}
                color={isFollowing ? PINK : "#fff"}
              />
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing && { color: PINK },
                ]}
              >
                {isFollowing ? " Following" : " Follow"}
              </Text>
            </Pressable>
          </Animated.View>
          <Pressable
            style={styles.messageButton}
            onPress={() => {
              // TODO: Chuyển sang màn chat
            }}
          >
            <Feather name="message-circle" size={16} color={PINK} />
            <Text style={styles.messageButtonText}> Message</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {otherProfile?.followingCount ?? 0}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {otherProfile?.followerCount ?? 0}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {otherProfile?.likeCount ?? 0}
            </Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {otherProfile?.profile?.bio && (
          <Text style={styles.bio}>{otherProfile.profile.bio}</Text>
        )}

        {/* === Tabs === */}
        <View style={styles.tabsWrap}>
          <View style={styles.tabs}>
            {TAB_KEYS.map((t, i) => {
              const active = t === tab;
              const iconName =
                t === "Videos" ? "play" : t === "Images" ? "image" : "heart";
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

      {/* Pager (hiện chỉ lấy page đang chọn) */}
      <View style={{ width: SCREEN_W }}>
        <FlatList
          data={PAGES[TAB_KEYS.indexOf(tab)].data}
          numColumns={COLS}
          keyExtractor={(it) => it._id}
          renderItem={renderGridItem}
          contentContainerStyle={{
            paddingHorizontal: GUTTER,
            paddingVertical: 10,
          }}
          columnWrapperStyle={{ gap: GUTTER }}
          ItemSeparatorComponent={() => <View style={{ height: GUTTER }} />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

export default OtherProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerCenter: { alignItems: "center", paddingVertical: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginVertical: 10 },
  name: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  username: { fontSize: 14, fontWeight: "600", color: "#666" },
  bio: { marginTop: 8, fontSize: 14, color: "#666", textAlign: "center" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PINK,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PINK,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#fff",
  },
  messageButtonText: {
    color: PINK,
    fontWeight: "600",
    fontSize: 14,
  },
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

// src/screens/FriendsScreen.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  LayoutChangeEvent,
  Keyboard,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { debounce } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchResults,
  clearSearchResults,
} from "../store/slices/user.search.slice";
import { RootState, AppDispatch } from "../store/store";
import UserCard from "../components/UserCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { followUser, unfollowUser } from "../store/slices/follow.slice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainTabParamList } from "../types/navigation";

const PINK = "#ff2d7a";
const GREY = "#8E8E93";
const BG = "#fff";
const PAGE_SIZE = 20; // nếu backend có pageSize khác thì sửa giá trị này

// ======= Search history config =======
const HISTORY_KEY = "friends_search_history";
const MAX_HISTORY = 8;

const FILTERS = ["All", "Following", "Followers", "Suggested"] as const;
type FilterKey = (typeof FILTERS)[number];

type Props = Partial<NativeStackScreenProps<MainTabParamList, "Friends">>;

const FriendsScreen: React.FC<Props> = ({ navigation }) => {
  const nav2 = navigation?.getParent();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.search);

  // ===== UI + search states =====
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterKey>("All");
  const [headerH, setHeaderH] = useState(0);

  // local loading flags
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);

  // load-more guards
  const onEndReachedCalledDuringMomentum = useRef(false);
  const reachedEndRef = useRef(false);
  const lastLengthRef = useRef(0);

  // ===== Search history states =====
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // load history on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (raw) setHistory(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  const saveHistory = useCallback(async (items: string[]) => {
    setHistory(items);
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {}
  }, []);

  const addToHistory = useCallback(
    async (text: string) => {
      const key = text.trim();
      if (!key) return;
      // dedupe + đưa lên đầu + cắt max
      const next = [
        key,
        ...history.filter((h) => h.toLowerCase() !== key.toLowerCase()),
      ].slice(0, MAX_HISTORY);
      await saveHistory(next);
    },
    [history, saveHistory]
  );

  const removeFromHistory = useCallback(
    async (text: string) => {
      const next = history.filter((h) => h !== text);
      await saveHistory(next);
    },
    [history, saveHistory]
  );

  const clearAllHistory = useCallback(async () => {
    await saveHistory([]);
  }, [saveHistory]);

  // filtered history theo query hiện tại
  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter((h) => h.toLowerCase().includes(q));
  }, [history, query]);

  // ====== Search (debounced) ======
  const doSearch = useCallback(
    async (
      text: string,
      pageNo = 1,
      mode: "search" | "refresh" | "paginate" = "search",
      shouldRemember = false
    ) => {
      try {
        if (mode === "search") setIsSearching(true);
        if (mode === "refresh") setIsRefreshing(true);
        if (mode === "paginate") setIsPaginating(true);

        const prevLen = lastLengthRef.current;
        // @ts-ignore unwrap nếu thunk hỗ trợ
        await dispatch(
          fetchSearchResults({ query: text, page: pageNo })
        ).unwrap?.();

        // nhớ lịch sử khi thực sự submit tìm kiếm
        if (shouldRemember) await addToHistory(text);

        // ước lượng còn dữ liệu không
        const newLen = users?.length ?? 0;
        const delta = newLen - prevLen;
        if (mode !== "search") {
          setTimeout(() => {
            const curr = (lastLengthRef.current = users?.length ?? 0);
            const grown = curr - prevLen;
            if (grown < PAGE_SIZE) reachedEndRef.current = true;
          }, 0);
        } else {
          reachedEndRef.current = false;
        }
      } finally {
        setIsSearching(false);
        setIsRefreshing(false);
        setIsPaginating(false);
        lastLengthRef.current = users?.length ?? 0;
      }
    },
    [dispatch, users?.length, addToHistory]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        dispatch(clearSearchResults());
        setPage(1);
        doSearch(text, 1, "search", false); // gõ phím thì không lưu history
      }, 450),
    [dispatch, doSearch]
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleSubmit = (text?: string) => {
    const q = (text ?? query).trim();
    Keyboard.dismiss();
    dispatch(clearSearchResults());
    reachedEndRef.current = false;
    setPage(1);
    setShowHistory(false);
    doSearch(q, 1, "search", true); // submit rõ ràng => lưu history
  };

  const handleClear = () => {
    setQuery("");
    dispatch(clearSearchResults());
    reachedEndRef.current = false;
    setPage(1);
    setShowHistory(false);
    doSearch("", 1, "search", false);
  };

  const handleViewProfile = (userId: string) => {
    console.log("View profile of", userId);
    nav2?.navigate("OtherProfile", { userId });
  };

  // ====== Load more / Refresh ======
  const onEndReached = () => {
    if (onEndReachedCalledDuringMomentum.current) return;
    if (isSearching || isRefreshing || isPaginating) return;
    if (reachedEndRef.current) return;
    if (!users || users.length === 0) return;

    onEndReachedCalledDuringMomentum.current = true;
    const next = page + 1;
    setPage(next);
    doSearch(query, next, "paginate", false);
  };

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    dispatch(clearSearchResults());
    reachedEndRef.current = false;
    setPage(1);
    doSearch(query, 1, "refresh", false);
  };

  // ====== Follow/Unfollow ======
  const handleFollow = (id: string) => dispatch(followUser(id));
  const handleUnfollow = (id: string) => dispatch(unfollowUser(id));

  // header size
  const onHeaderLayout = (e: LayoutChangeEvent) =>
    setHeaderH(e.nativeEvent.layout.height);

  // filters (client-side)
  const filteredUsers = useMemo(() => {
    switch (filter) {
      case "Following":
        return users.filter((u) => u.isFollowed);
      case "Followers":
        return users.filter((u) => u.isFollower);
      case "Suggested":
        return users.filter((u) => !u.isFollower && !u.isFollowed);
      default:
        return users;
    }
  }, [users, filter]);

  // first load
  useEffect(() => {
    doSearch("", 1, "search", false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {/* ===== Fixed Header ===== */}
      <View
        style={[styles.headerWrap, { paddingTop: insets.top + 6 }]}
        onLayout={onHeaderLayout}
      >
        <View style={styles.topRow}>
          {/* <Text style={styles.title}>Friends</Text> */}
          {/* <Pressable style={{ padding: 6 }}>
            <Feather name="bell" size={20} color={GREY} />
          </Pressable> */}
        </View>

        {/* Search box */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color={GREY} />
            <TextInput
              value={query}
              onChangeText={handleQueryChange}
              placeholder="Search friends"
              placeholderTextColor="#B0B0B0"
              style={styles.input}
              returnKeyType="search"
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 120)}
              onSubmitEditing={() => handleSubmit()}
            />
            {!!query && !(isSearching || isRefreshing || isPaginating) && (
              <Pressable onPress={handleClear} hitSlop={8}>
                <Feather name="x" size={18} color={GREY} />
              </Pressable>
            )}
            {(isSearching || isRefreshing) && (
              <ActivityIndicator size="small" color={PINK} />
            )}
          </View>
        </View>

        {/* Search history dropdown (show in header, không cuộn) */}
        {showHistory && filteredHistory.length > 0 && (
          <View style={styles.historyPanel}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Recent searches</Text>
              <Pressable onPress={clearAllHistory} hitSlop={6}>
                <Text style={styles.clearAll}>Clear all</Text>
              </Pressable>
            </View>
            <FlatList
              data={filteredHistory}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.historyRow}>
                  <Pressable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      gap: 8,
                    }}
                    onPress={() => {
                      setQuery(item);
                      handleSubmit(item);
                    }}
                  >
                    <Feather name="clock" size={16} color={GREY} />
                    <Text style={styles.historyText} numberOfLines={1}>
                      {item}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => removeFromHistory(item)}
                    hitSlop={8}
                  >
                    <Feather name="x" size={18} color={GREY} />
                  </Pressable>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              style={{ maxHeight: 220 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Filters
        <View style={styles.filterRow}>
          {FILTERS.map((key) => {
            const active = key === filter;
            return (
              <Pressable
                key={key}
                onPress={() => setFilter(key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {key}
                </Text>
              </Pressable>
            );
          })}
        </View> */}

        {/* Meta */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}{" "}
            {query ? `for “${query}”` : ""}
          </Text>
        </View>
      </View>

      {/* ===== List ===== */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserCard
            onPress={() => handleViewProfile(item._id)}
            id={item._id}
            displayName={item.profile.displayName}
            name={item.username}
            avatar={item.profile.avatar}
            isFollower={item.isFollower}
            isFollowed={item.isFollowed}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 96,
          paddingTop: headerH || 180, // cao hơn vì có dropdown
        }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.35}
        onEndReached={onEndReached}
        onMomentumScrollBegin={onMomentumScrollBegin}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[PINK]}
            tintColor={PINK}
          />
        }
        ListEmptyComponent={
          !(isSearching || isRefreshing || isPaginating) ? (
            <View style={styles.emptyWrap}>
              <Feather name="user-x" size={44} color={GREY} />
              <Text style={styles.emptyTitle}>No friends found</Text>
              <Text style={styles.emptySub}>
                Thử từ khóa khác hoặc chuyển bộ lọc.
              </Text>
              {!!query && (
                <Pressable style={styles.clearBtn} onPress={handleClear}>
                  <Text style={styles.clearBtnText}>Clear search</Text>
                </Pressable>
              )}
            </View>
          ) : null
        }
        ListFooterComponent={
          isPaginating && filteredUsers.length > 0 ? (
            <View style={{ paddingVertical: 14 }}>
              <ActivityIndicator color={PINK} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: BG,
    zIndex: 50,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    paddingBottom: 8,
  },
  topRow: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "800", color: PINK },

  // Search
  searchRow: { paddingHorizontal: 16, marginBottom: 8 },
  searchBox: {
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, color: "#222" },

  // History dropdown
  historyPanel: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    paddingVertical: 8,
    marginTop: -2,
    marginBottom: 6,
    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  historyHeader: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyTitle: { fontWeight: "700", color: "#333" },
  clearAll: { color: PINK, fontWeight: "600" },
  historyRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  historyText: { color: "#333", flex: 1 },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee",
    marginHorizontal: 12,
  },

  // Filters
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#f6f7fb",
  },
  chipActive: { backgroundColor: "#ffe6ef" },
  chipText: { color: "#5d6a7a", fontWeight: "600" },
  chipTextActive: { color: PINK },

  metaRow: { paddingHorizontal: 16, paddingTop: 6 },
  metaText: { color: "#8b97a8", fontSize: 12 },

  // Empty
  emptyWrap: { alignItems: "center", paddingVertical: 32, gap: 6 },
  emptyTitle: { fontWeight: "800", fontSize: 16, color: "#333" },
  emptySub: { color: "#7a7a7a" },
  clearBtn: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#ffe6ef",
  },
  clearBtnText: { color: PINK, fontWeight: "700" },
});

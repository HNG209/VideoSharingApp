import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Pressable,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList, RootStackParamList } from "../types/navigation";

const PINK = "#ff2d7a";
const GREY = "#8E8E93";
const BG = "#fff";
const { width } = Dimensions.get("window");

const TABS = [
  { key: "following", label: "Following" },
  { key: "followers", label: "Followers" },
];

// Dummy data
const user = {
  name: "Ruth Sanders",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  followers: 368,
  following: 456,
};

const followingList = [
  {
    id: "1",
    name: "Kiran Glaucus",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "2",
    name: "Sally Rooney",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "3",
    name: "Marie Franco",
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    id: "4",
    name: "Jena Nguyen",
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    id: "5",
    name: "Kristin Watson",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
  },
];

const suggestions = [
  {
    id: "6",
    name: "Bobby Sandoval",
    avatar: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    id: "7",
    name: "Jennie Ponce",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    id: "8",
    name: "Anja O'Connor",
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
  },
];

type Props = Partial<NativeStackScreenProps<RootStackParamList, "Follow">>;

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const FollowScreen: React.FC<Props> = ({ route, navigation }) => {
  const { initialTab, user } = route?.params || {};
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    initialTab || "following"
  );
  const [suggested, setSuggested] = useState(suggestions);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  // Lọc danh sách theo search
  const filteredList = useMemo(() => {
    const list = followingList; // bạn có thể thay đổi theo tab
    if (!debouncedSearch.trim()) return list;
    return list.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
    );
  }, [debouncedSearch]);

  const renderUserRow = (item: any, isFollowing = true) => (
    <View style={styles.userRow}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.userName}>{item.name}</Text>
      <View style={{ flex: 1 }} />
      {isFollowing ? (
        <TouchableOpacity style={styles.followingBtn}>
          <Text style={styles.followingBtnText}>Following</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followBtnText}>Follow</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.moreBtn}>
        <Feather name="more-vertical" size={20} color={GREY} />
      </TouchableOpacity>
    </View>
  );

  const renderSuggestionRow = (item: any) => (
    <View style={styles.userRow}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.userName}>{item.name}</Text>
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={styles.followBtn}>
        <Text style={styles.followBtnText}>Follow</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() =>
          setSuggested((prev) => prev.filter((u) => u.id !== item.id))
        }
      >
        <Feather name="x" size={20} color={GREY} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation?.goBack()}
        >
          <Feather name="arrow-left" size={22} color="#222" />
        </TouchableOpacity>
        <Image
          source={{ uri: user?.profile.avatar }}
          style={styles.headerAvatar}
        />
        <Text style={styles.headerName}>
          {user?.profile.displayName || user?.username}
        </Text>
        <View style={{ flex: 1 }} />
        {/* Bỏ nút tìm kiếm và menu */}
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab, idx) => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {user[tab.key]} {tab.label}
              </Text>
              {active && <View style={styles.tabUnderline} />}
            </Pressable>
          );
        })}
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchBarWrap}>
        <Feather
          name="search"
          size={18}
          color={GREY}
          style={{ marginLeft: 10 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={GREY}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.divider} />

      {/* List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderUserRow(item, true)}
        ListFooterComponent={
          <>
            <Text style={styles.suggestTitle}>Suggestions for you</Text>
            {suggested.map((item) => renderSuggestionRow(item))}
          </>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default FollowScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: BG,
  },
  headerIcon: {
    padding: 6,
    marginHorizontal: 2,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 10,
  },
  headerName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#222",
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 2,
    gap: 24,
  },
  tabBtn: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 0,
    minWidth: 110,
  },
  tabText: {
    fontSize: 16,
    color: GREY,
    fontWeight: "600",
  },
  tabTextActive: {
    color: PINK,
  },
  tabUnderline: {
    marginTop: 4,
    height: 3,
    width: "100%",
    backgroundColor: PINK,
    borderRadius: 2,
  },
  searchBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    height: 38,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
    marginHorizontal: 0,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: BG,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
  },
  userName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#222",
    marginLeft: 8,
  },
  followBtn: {
    backgroundColor: PINK,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginHorizontal: 4,
  },
  followBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  followingBtn: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  followingBtnText: {
    color: GREY,
    fontWeight: "700",
    fontSize: 15,
  },
  moreBtn: {
    padding: 6,
    marginLeft: 2,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 2,
  },
  suggestTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#888",
    backgroundColor: "#fafbfc",
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 8,
    marginBottom: 2,
  },
});

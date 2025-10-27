import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchResults,
  clearSearchResults,
} from "../store/slices/user.search.slice";
import { RootState, AppDispatch } from "../store/store";
import UserCard from "../components/UserCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { followUser, unfollowUser } from "../store/slices/follow.slice";

const PINK = "#ff2d7a";
const GREY = "#8E8E93";

const FriendsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading } = useSelector((state: RootState) => state.search);

  const [query, setQuery] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      dispatch(clearSearchResults());
      dispatch(fetchSearchResults({ query: text, page: 1 }));
    }, 500),
    [dispatch]
  );

  // Handle query change
  const handleQueryChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleFollow = (id: string) => {
    console.log("Follow/Unfollow user:", id);
    dispatch(followUser(id));
  };

  const handleUnfollow = (id: string) => {
    console.log("Follow/Unfollow user:", id);
    dispatch(unfollowUser(id));
  };

  return (
    <View style={[styles.container, { marginTop: insets.top }]}>
      {/* Search */}
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
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <UserCard
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
          padding: 16,
          paddingBottom: 96,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading && <Text style={styles.emptyText}>No friends found</Text>
        }
      />
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f4f5f7",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, color: "#222" },
  emptyText: {
    textAlign: "center",
    color: GREY,
    marginTop: 20,
    fontSize: 16,
  },
});

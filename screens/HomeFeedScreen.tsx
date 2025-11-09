import React, { useRef, useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { VideoPostScreen } from "./VideoPostScreen";
import { AppDispatch, RootState } from "../store/store";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { HomeStackParamList, RootStackParamList } from "../types/navigation";
import { fetchUserFeed } from "../store/slices/feed.slice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

type Props = Partial<NativeStackScreenProps<HomeStackParamList, "HomeFeed">>;
type RootNavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const HomeFeedScreen = ({ route }: Props) => {
  const navigation = useNavigation<RootNavigationProps>(); // test

  const flatListRef = useRef<FlatList>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"recommend" | "friends">(
    "recommend"
  );
  const posts = useSelector((state: RootState) => state.feed.posts);
  const user = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setVisibleIndex(viewableItems[0].index);
      }
    }
  ).current;

  useEffect(() => {
    dispatch(fetchUserFeed());
  }, []);

  if (!posts || posts.length === 0) {
    return <View style={[styles.container, { backgroundColor: "black" }]} />;
  }

  const handleProfilePress = (authorId: string) => {
    if (authorId === user?._id) {
      navigation.navigate("MainTab", {
        screen: "ProfileDrawer",
        params: {
          screen: "ProfileStack",
          params: {
            screen: "Profile",
          },
        },
      });
      // navigation
      //   ?.getParent() // Lấy navigator cha (MainTab)
      //   ?.navigate("ProfileDrawer", {
      //     // 1. Yêu cầu MainTab chuyển đến tab "ProfileDrawer"
      //     screen: "ProfileStack", // 2. YÊU CẦU ProfileDrawer chuyển đến màn hình "ProfileStack"
      //     params: {
      //       screen: "Profile", // 3. YÊU CẦU ProfileStack chuyển đến màn hình "Profile"
      //     },
      //   });

      return;
    }

    // Tương tự cho OtherProfile
    // navigation?.getParent()?.navigate("OtherProfile", {
    //   screen: "UserProfile",
    //   params: { userId: authorId },
    // });
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("recommend")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.menuText,
                activeTab === "recommend" && styles.menuTextActive,
              ]}
            >
              Đề xuất
            </Text>
            {activeTab === "recommend" && <View style={styles.underline} />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("friends")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.menuText,
                activeTab === "friends" && styles.menuTextActive,
              ]}
            >
              Bạn bè
            </Text>
            {activeTab === "friends" && <View style={styles.underline} />}
          </TouchableOpacity>
        </View>

        {/* Nút tìm kiếm */}
        <TouchableOpacity
          style={[styles.searchButton, { marginTop: insets.top }]}
          activeOpacity={0.8}
          onPress={() => console.log("Search pressed")}
        >
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        windowSize={3}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        renderItem={({ item, index }) => (
          <VideoPostScreen
            post={item}
            isVisible={index === visibleIndex}
            onProfilePress={() => handleProfilePress(item.author._id)}
          />
        )}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  menuContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: "#aaa",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
  menuTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  underline: {
    marginTop: 3,
    height: 2,
    width: "60%",
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 2,
  },
  searchButton: {
    position: "absolute",
    right: 16,
    alignSelf: "center", // ✅ căn giữa hàng chữ
    transform: [{ translateY: 2 }], // tinh chỉnh nhỏ để icon cân hoàn hảo
  },
});

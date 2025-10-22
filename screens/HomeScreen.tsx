import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";
import BottomBar, { BottomKey } from "../components/ProfileDetails/BottomBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = Partial<NativeStackScreenProps<AppStackParamList, "Home">>;
const { width } = Dimensions.get("window");
const PINK = "#ff2d7a";
const GREY = "#8E8E93";

const useHomeData = () => {
  const stories = useMemo(() => {
    const randomNames = [
      "Adam",
      "William",
      "Peter",
      "Julia",
      "Rose",
      "Sophia",
      "David",
      "Liam",
    ];
    const generated = Array.from({ length: randomNames.length }, (_, i) => ({
      id: `${i + 1}`,
      name: randomNames[i],
      avatar: `https://i.pravatar.cc/100?img=${
        Math.floor(Math.random() * 70) + 1
      }`,
    }));
    return [
      {
        id: "me",
        name: "You",
        avatar: "https://i.pravatar.cc/100?img=64",
        you: true,
      },
      ...generated,
    ];
  }, []);

  const trending = useMemo(() => {
    const sampleTitles = [
      "Lovely",
      "Sweet",
      "Explore",
      "Adventure",
      "Dreamscape",
      "Nature",
      "City Lights",
      "Moments",
      "Journey",
      "Memories",
    ];
    return Array.from({ length: 20 }, (_, i) => ({
      id: `t${i + 1}`,
      title: sampleTitles[i % sampleTitles.length],
      img: `https://picsum.photos/seed/trend${i + 1}/600/400`,
      views: `${(Math.random() * 3 + 1).toFixed(1)}M views`,
    }));
  }, []);

  const topics = useMemo(
    () =>
      [
        {
          key: "sports",
          label: "Sports",
          icon: <Feather name="activity" size={18} color={PINK} />,
        },
        {
          key: "podcasts",
          label: "Podcasts",
          icon: <Feather name="mic" size={18} color={PINK} />,
        },
        {
          key: "news",
          label: "News",
          icon: <Feather name="file-text" size={18} color={PINK} />,
        },
        {
          key: "travel",
          label: "Travel",
          icon: <Feather name="globe" size={18} color={PINK} />,
        },
        {
          key: "health",
          label: "Health",
          icon: <Feather name="heart" size={18} color={PINK} />,
        },
        {
          key: "weather",
          label: "Weather",
          icon: <Feather name="cloud" size={18} color={PINK} />,
        },
        {
          key: "art",
          label: "Art",
          icon: <Feather name="image" size={18} color={PINK} />,
        },
        {
          key: "more",
          label: "+20\nTopics",
          icon: <Feather name="hash" size={18} color={PINK} />,
        },
      ] as const,
    []
  );

  const streaming = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: `s${i + 1}`,
        title: ["Lifestyle", "Cooking", "Dancing"][i % 3],
        img: `https://picsum.photos/seed/stream${i + 1}/600/400`,
        ago: i % 2 === 0 ? "1 min ago" : "45 min ago",
        author: `https://i.pravatar.cc/100?img=${10 + i}`,
        views: `${(Math.random() * 2 + 1).toFixed(1)}M views`,
      })),
    []
  );

  const audio = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: `a${i + 1}`,
        title: ["Perfect lady", "Experience", "Yourself", "Sunshine"][i % 4],
        subtitle: ["Bookcase", "Lifestyle", "Bookcase", "Lifestyle"][i % 4],
        img: `https://picsum.photos/seed/audio${i + 1}/500/500`,
      })),
    []
  );

  return { stories, trending, topics, streaming, audio };
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { stories, trending, topics, streaming, audio } = useHomeData();
  const insets = useSafeAreaInsets();

  const handleOpenTrending = (id: string) => {
    navigation?.navigate?.("ProfileDetails", { id });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            {/* <View style={styles.logoDot} /> */}
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>Video Sharing App</Text>
          </View>
          <Pressable style={{ padding: 6 }}>
            <Feather name="bell" size={20} color={GREY} />
          </Pressable>
        </View>

        {/* Stories */}
        <FlatList
          data={stories as any}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 8,
            gap: 16,
          }}
          renderItem={({ item }: any) => (
            <View style={{ alignItems: "center" }}>
              <View style={styles.storyCircle}>
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.storyAvatar}
                />
                {item.you && (
                  <View style={styles.plusBadge}>
                    <Ionicons name="add" size={12} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          )}
        />

        <SectionHeader title="Top trending" onMore={() => {}} />
        <FlatList
          horizontal
          data={trending as any}
          keyExtractor={(it) => it.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }: any) => (
            <Pressable
              onPress={() => handleOpenTrending(item.id)}
              style={styles.trendCard}
            >
              <Image
                source={{ uri: item.img }}
                style={StyleSheet.absoluteFillObject as any}
              />
              <View style={styles.trendOverlay} />
              <Text style={styles.trendTitle}>{item.title}</Text>
              <View style={styles.viewRow}>
                <Feather name="play" size={12} color="#fff" />
                <Text style={styles.viewText}>1.5M views</Text>
              </View>
            </Pressable>
          )}
        />

        <SectionHeader title="Browse topics" onMore={() => {}} />
        <View style={styles.topicGrid}>
          {(topics as any).map((t: any) => (
            <Pressable key={t.key} style={styles.topicItem} onPress={() => {}}>
              <View style={styles.topicIcon}>{t.icon}</View>
              <Text style={styles.topicText} numberOfLines={2}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="Streaming" onMore={() => {}} />
        <FlatList
          horizontal
          data={streaming as any}
          keyExtractor={(it) => it.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }: any) => (
            <Pressable
              style={styles.streamCard}
              onPress={() => handleOpenTrending(item.id)}
            >
              <Image
                source={{ uri: item.img }}
                style={StyleSheet.absoluteFillObject as any}
              />
              <View style={styles.labelBadge}>
                <Text style={styles.badgeText}>{item.ago}</Text>
              </View>
              <View style={styles.streamFooter}>
                <Text style={styles.streamTitle}>{item.title}</Text>
                <View style={styles.streamMeta}>
                  <Feather name="play" size={10} color="#fff" />
                  <Text style={styles.streamViews}>{item.views}</Text>
                  <Image
                    source={{ uri: item.author }}
                    style={styles.streamAuthor}
                  />
                </View>
              </View>
            </Pressable>
          )}
        />

        {/* Audio */}
        <SectionHeader title="Audio" onMore={() => {}} />
        <FlatList
          horizontal
          data={audio as any}
          keyExtractor={(it) => it.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }: any) => (
            <Pressable style={styles.audioItem}>
              <Image source={{ uri: item.img }} style={styles.audioImg} />
              <Text style={styles.audioTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.audioSub} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </Pressable>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const SectionHeader = ({
  title,
  onMore,
}: {
  title: string;
  onMore?: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.blockTitle}>{title}</Text>
    <Pressable hitSlop={8} onPress={onMore}>
      <Text style={{ color: PINK, fontWeight: "600" }}>View more</Text>
    </Pressable>
  </View>
);

const CARD_W = width * 0.58;
const STREAM_W = width * 0.58;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    // backgroundColor: "black",
  },
  logoDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: PINK },
  title: { fontSize: 18, fontWeight: "800", color: "#ff2d7a" },
  storyCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  storyAvatar: { width: 52, height: 52, borderRadius: 26 },
  storyName: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
    width: 60,
    textAlign: "center",
  },
  plusBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  sectionHeader: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blockTitle: { fontSize: 16, fontWeight: "800" },

  trendCard: {
    width: CARD_W,
    height: CARD_W * 0.72,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  trendOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  trendTitle: {
    position: "absolute",
    left: 12,
    bottom: 28,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  viewRow: {
    position: "absolute",
    left: 10,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewText: { color: "#fff", fontSize: 12 },

  topicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
    columnGap: 12,
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 6,
  },
  topicItem: {
    width: (width - 16 * 2 - 12 * 3) / 4,
    height: 66,
    borderRadius: 12,
    backgroundColor: "#f6f7f9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  topicIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ffe6ef",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  topicText: { textAlign: "center", fontSize: 12, color: "#444" },

  streamCard: {
    width: STREAM_W,
    height: STREAM_W * 0.7,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  labelBadge: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: PINK,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  streamFooter: { position: "absolute", left: 10, right: 10, bottom: 8 },
  streamTitle: { color: "#fff", fontWeight: "700", marginBottom: 4 },
  streamMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  streamViews: { color: "#fff", fontSize: 12 },
  streamAuthor: { width: 18, height: 18, borderRadius: 9, marginLeft: "auto" },

  audioItem: { width: 112 },
  audioImg: {
    width: 112,
    height: 112,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  audioTitle: { marginTop: 8, fontWeight: "700" },
  audioSub: { color: "#7a7a7a", fontSize: 12 },
});

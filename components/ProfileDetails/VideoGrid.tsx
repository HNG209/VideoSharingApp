import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import VideoCard from "../VideoCard";

const GUTTER = 10, COLS = 3;
const W = Dimensions.get("window").width;
const CARD_W = (W - (COLS + 1) * GUTTER) / COLS;

export type Media = { id: string; thumbnail: string; views?: string };

export default function VideoGrid({
  data, bottomPadding=0, onPressItem,
}: {
  data: Media[]; bottomPadding?: number; onPressItem?: (id:string)=>void;
}) {
  return (
    <FlatList
      data={data}
      numColumns={COLS}
      keyExtractor={(it) => it.id}
      renderItem={({ item }) => (
        <VideoCard
          thumbnail={item.thumbnail}
          views={item.views}
          width={CARD_W}
          height={CARD_W * 1.45}
          onPress={() => onPressItem?.(item.id)}
        />
      )}
      contentContainerStyle={{ paddingHorizontal: GUTTER, paddingTop: 12, paddingBottom: bottomPadding }}
      columnWrapperStyle={{ gap: GUTTER }}
      ItemSeparatorComponent={() => <View style={{ height: GUTTER }} />}
      scrollEnabled={false}
    />
  );
}

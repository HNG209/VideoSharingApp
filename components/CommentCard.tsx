import React from "react";
import { CommentModel } from "../types/comment";
import { Image, StyleSheet, Text, View } from "react-native";

interface Props {
  comment: CommentModel;
}

const CommentCard = ({ comment }: Props) => (
  <View style={styles.commentCard}>
    <Image
      source={{ uri: comment.author.profile.avatar }}
      style={styles.commentAvatar}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.commentName}>
        {comment.author.profile.displayName}
      </Text>
      <Text style={styles.commentContent}>{comment.content}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  commentCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 10,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: "#eee",
  },
  commentName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#222",
  },
  commentContent: {
    color: "#222",
    fontSize: 15,
    marginTop: 2,
  },
});

export default React.memo(CommentCard);

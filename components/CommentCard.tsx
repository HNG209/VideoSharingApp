import { Image, StyleSheet, Text, View } from "react-native";

const CommentCard = ({ comment }: { comment: any }) => (
  <View style={styles.commentCard}>
    <Image
      source={{ uri: comment.user.profile.avatar }}
      style={styles.commentAvatar}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.commentName}>{comment.user.profile.displayName}</Text>
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

export default CommentCard;

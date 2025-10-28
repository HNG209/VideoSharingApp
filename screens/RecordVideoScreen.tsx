// src/screens/RecordVideoScreen.tsx
import React, { useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Video, ResizeMode } from "expo-av";

const PINK = "#ff2d7a";

export default function RecordVideoScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const camRef = useRef<CameraView>(null);
  const [perm, requestPerm] = useCameraPermissions();
  const [mlPerm, requestMLPerm] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [isRecording, setIsRecording] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

  if (!perm?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Cần quyền Camera/Micro</Text>
        <Pressable style={styles.primary} onPress={requestPerm}>
          <Text style={styles.primaryText}>Cấp quyền</Text>
        </Pressable>
      </View>
    );
  }

  const toggleRecord = async () => {
  if (isRecording) {
    // stop quay
    setIsRecording(false);
    await camRef.current?.stopRecording();
  } else {
    setUri(null);
    setIsRecording(true);
    try {
      // recordAsync trả Promise<RecordingResult>
      const result = await camRef.current?.recordAsync({
        maxDuration: 60,
        quality: "1080p",
      } as any);

      if (result?.uri) {
        setUri(result.uri);
      }
    } catch (error) {
      console.error("Record error:", error);
    } finally {
      setIsRecording(false);
    }
  }
};


  const handleSave = async () => {
    if (!mlPerm?.granted) await requestMLPerm();
    if (uri) await MediaLibrary.saveToLibraryAsync(uri);
  };

  const handleNext = () => {
    // TODO: nếu bạn có PostVideoScreen thì navigate sang đó, truyền uri
    // navigation.navigate("PostVideo", { uri });
    navigation.goBack();
  };

  if (uri) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Video
            source={{ uri }}
            style={{ flex: 1 }}
            resizeMode={ResizeMode.CONTAIN}   
            shouldPlay
            isLooping
            useNativeControls
            />
        <View style={styles.previewBar}>
          <Pressable style={styles.secondary} onPress={() => setUri(null)}>
            <Feather name="rotate-ccw" size={18} color={PINK} />
            <Text style={styles.secondaryText}>Quay lại</Text>
          </Pressable>
          <Pressable style={styles.ghost} onPress={handleSave}>
            <Text style={styles.ghostText}>Lưu</Text>
          </Pressable>
          <Pressable style={styles.primary} onPress={handleNext}>
            <Text style={styles.primaryText}>Next</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <CameraView ref={camRef} style={styles.fill} facing={facing} mode="video" />

      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.round} onPress={() => navigation.goBack()}>
          <Feather name="x" size={22} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.round}
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
        >
          <Feather name="refresh-ccw" size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <Pressable
          onPress={toggleRecord}
          style={[styles.recBtn, isRecording && { backgroundColor: "#ff4d6d" }]}
        >
          <View
            style={[
              styles.recInner,
              isRecording && { width: 26, height: 26, borderRadius: 6 },
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontWeight: "800", fontSize: 16, marginBottom: 12, color: "#333" },

  topBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    paddingHorizontal: 12, flexDirection: "row",
    justifyContent: "space-between", alignItems: "center",
  },

  bottom: {
    position: "absolute", left: 0, right: 0, bottom: 32,
    alignItems: "center", justifyContent: "center",
  },

  recBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: PINK,
  },
  recInner: { width: 42, height: 42, borderRadius: 21, backgroundColor: PINK },

  previewBar: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 16, flexDirection: "row", justifyContent: "space-between",
    alignItems: "center",
  },

  primary: { backgroundColor: PINK, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  primaryText: { color: "#fff", fontWeight: "700" },

  ghost: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#fff" },
  ghostText: { color: "#fff", fontWeight: "700" },

  secondary: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: "#fff",
  },
  secondaryText: { color: PINK, fontWeight: "700" },

  round: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center", justifyContent: "center",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { updateProfileService } from "../services/user.service";
import { updateProfile } from "../store/slices/auth.slice";

type Props = Partial<
  NativeStackScreenProps<ProfileStackParamList, "EditProfile">
>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [displayName, setDisplayName] = useState(
    user?.profile.displayName || ""
  );
  const [bio, setBio] = useState(user?.profile.bio || "");
  const [avatar, setAvatar] = useState(user?.profile.avatar || "");
  const [preview, setPreview] = useState<string | null>(null); // ảnh chọn tạm thời

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPreview(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!displayName) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên hiển thị");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("displayName", displayName);
      formData.append("bio", bio);

      if (preview) {
        const filename = preview.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const ext = match ? match[1] : "jpg";
        const type = `image/${ext}`;

        formData.append("avatar", {
          uri: preview,
          name: filename,
          type,
        } as any);
      }

      dispatch(updateProfile(formData)).unwrap();

      Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật hồ sơ");
      console.error(error);
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: preview || avatar }} style={styles.avatar} />
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.changeAvatarText}>Đổi ảnh đại diện</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Tên hiển thị</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Nhập tên hiển thị"
        />

        <Text style={styles.label}>Giới thiệu</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Giới thiệu bản thân"
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.saveText}>Trở về</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  changeAvatarText: { color: "#ff2d7a", fontWeight: "500" },
  form: {},
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  bioInput: { height: 100, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "#ff2d7a",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#888",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

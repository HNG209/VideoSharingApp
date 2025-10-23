import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { updatePasswordService } from "../services/user.service";
const ICON_GREY = "#8E8E93";

const ChangePasswordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      //   await updatePasswordService(values.currentPassword, values.newPassword);
      Alert.alert("Thông báo", "Cập nhật mật khẩu thành công!");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Cập nhật mật khẩu thất bại.");
    }
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
    newPassword: Yup.string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu mới"),
  });

  return (
    <View style={[styles.container, { marginTop: insets.top }]}>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        style={styles.drawerIcon}
      >
        <Feather name="menu" size={24} color={ICON_GREY} />
      </TouchableOpacity>
      <Text style={styles.title}>Đổi mật khẩu</Text>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleChangePassword}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              placeholder="Mật khẩu hiện tại"
              secureTextEntry
              style={[
                styles.input,
                touched.currentPassword && errors.currentPassword
                  ? styles.inputError
                  : null,
              ]}
              onChangeText={handleChange("currentPassword")}
              onBlur={handleBlur("currentPassword")}
              value={values.currentPassword}
            />
            {touched.currentPassword && errors.currentPassword && (
              <Text style={styles.error}>{errors.currentPassword}</Text>
            )}

            <TextInput
              placeholder="Mật khẩu mới"
              secureTextEntry
              style={[
                styles.input,
                touched.newPassword && errors.newPassword
                  ? styles.inputError
                  : null,
              ]}
              onChangeText={handleChange("newPassword")}
              onBlur={handleBlur("newPassword")}
              value={values.newPassword}
            />
            {touched.newPassword && errors.newPassword && (
              <Text style={styles.error}>{errors.newPassword}</Text>
            )}

            <TextInput
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              style={[
                styles.input,
                touched.confirmPassword && errors.confirmPassword
                  ? styles.inputError
                  : null,
              ]}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  drawerIcon: {
    position: "absolute",
    top: 20, // Khoảng cách từ trên cùng (tùy chỉnh theo thiết kế)
    left: 20, // Khoảng cách từ bên trái
    zIndex: 10, // Đảm bảo icon nằm trên các thành phần khác
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ff2d7a",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "#ff4d4f",
  },
  button: {
    backgroundColor: "#ff2d7a",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
  },
});

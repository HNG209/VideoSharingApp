// src/screens/LoginScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LoginValues } from "../types/user";
import { login } from "../store/slices/auth.slice";
import { AppDispatch, RootState } from "../store/store";
import LoadingScreen from "./LoadingScreen";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Bắt buộc nhập tên đăng nhập"),
  password: Yup.string()
    .min(6, "Tối thiểu 6 ký tự")
    .required("Bắt buộc nhập mật khẩu"),
});

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector((state: RootState) => state.auth.status);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Dùng cho cả 2 bước
  const [tempLoginValues, setTempLoginValues] = useState<LoginValues | null>(
    null
  ); // Lưu trữ user/pass tạm thời

  const handleLogin = async (values: LoginValues) => {
    setIsLoggingIn(true);
    setTempLoginValues(values); // Lưu thông tin đăng nhập tạm thời

    try {
      // Thử đăng nhập lần đầu (không có OTP)
      await dispatch(login(values)).unwrap(); // Nếu thành công, không cần làm gì thêm
    } catch (error: any) {
      const errorString = String(error).trim();
      // console.log(errorString === "Required OTP");
      if (error) {
        setIsModalVisible(true);
        // Gặp lỗi 2FA, mở modal để nhập OTP
      } else {
        // Lỗi đăng nhập khác (sai user/pass)
        Alert.alert("Thông báo", error.toString() || "Đăng nhập thất bại.");
        setTempLoginValues(null); // Xóa thông tin tạm thời nếu không phải lỗi OTP
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      return Alert.alert("Lỗi", "Mã OTP phải có 6 chữ số.");
    }
    if (!tempLoginValues) {
      return Alert.alert("Lỗi", "Không tìm thấy thông tin đăng nhập.");
    }

    setIsLoggingIn(true);
    try {
      // Thử đăng nhập lại, truyền kèm mã OTP
      await dispatch(
        login({
          ...tempLoginValues,
          otp: otpCode, // Gửi mã OTP lên server
        })
      ).unwrap(); // Thành công

      setIsModalVisible(false);
      setOtpCode("");
      setTempLoginValues(null);
    } catch (error: any) {
      // Lỗi OTP hoặc lỗi server sau khi gửi OTP
      Alert.alert("Thông báo", error.toString() || "Mã OTP không chính xác.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (authStatus === "loading" || authStatus === "idle") {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* <Image source={require("../assets/logo.png")} style={styles.logo} /> */}
      <Text style={styles.title}>Đăng nhập</Text>

      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          submitCount,
        }) => (
          <>
            <TextInput
              placeholder="Tên đăng nhập"
              style={[
                styles.input,
                errors.username && submitCount > 0 ? styles.inputError : null,
              ]}
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Mật khẩu"
              secureTextEntry
              style={[
                styles.input,
                errors.password && submitCount > 0 ? styles.inputError : null,
              ]}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />

            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Modal OTP */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>Xác Thực 2 Yếu Tố</Text>
            <Text style={modalStyles.modalText}>
              Vui lòng nhập mã 6 chữ số từ ứng dụng Authenticator của bạn.
            </Text>
            <TextInput
              style={modalStyles.input}
              onChangeText={setOtpCode}
              value={otpCode}
              placeholder="Nhập mã OTP (6 chữ số)"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus={true}
              editable={!isLoggingIn}
            />
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.buttonClose]}
                onPress={() => {
                  setIsModalVisible(false);
                  setOtpCode("");
                  setTempLoginValues(null); // Xóa thông tin đã lưu khi hủy
                }}
                disabled={isLoggingIn}
              >
                <Text style={modalStyles.textStyle}>Hủy</Text> 
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: "#ff2d7a" }]}
                onPress={handleVerifyOTP}
                disabled={isLoggingIn || otpCode.length !== 6}
              >
                {isLoggingIn ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={modalStyles.textStyle}>Xác Nhận</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#666",
  },
  input: {
    height: 50,
    width: "100%",
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: "#767577",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ff2d7a",
    marginBottom: 30,
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
    shadowColor: "#ff4d4f",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  button: {
    backgroundColor: "#ff2d7a",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  link: { color: "#ff2d7a", marginTop: 15, textAlign: "center" },
  error: { color: "red", fontSize: 13 },
});

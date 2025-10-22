// src/screens/RegisterScreen.tsx
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import { RegisterValues } from "../types/user";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { registerUserService } from "../services/user.service";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const registerSchema = Yup.object().shape({
  username: Yup.string().required("Nhập tên người dùng"),
  email: Yup.string().email("Email không hợp lệ").required("Nhập email"),
  password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Nhập mật khẩu"),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Nhập lại mật khẩu"),
});

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async (values: RegisterValues) => {
    try {
      await registerUserService(values);
      Alert.alert("Đăng ký thành công", "Vui lòng đăng nhập.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Đăng ký thất bại", "Vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleSubmit, values, errors, submitCount }) => (
          <>
            {/* Tên người dùng */}
            <TextInput
              placeholder="Tên người dùng"
              style={[
                styles.input,
                errors.username && submitCount > 0 ? styles.inputError : null,
              ]}
              onChangeText={handleChange("username")}
              value={values.username}
            />

            {/* Email */}
            <TextInput
              placeholder="Email"
              style={[
                styles.input,
                errors.email && submitCount > 0 ? styles.inputError : null,
              ]}
              onChangeText={handleChange("email")}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Mật khẩu */}
            <TextInput
              placeholder="Mật khẩu"
              secureTextEntry
              style={[
                styles.input,
                errors.password && submitCount > 0 ? styles.inputError : null,
              ]}
              onChangeText={handleChange("password")}
              value={values.password}
            />

            {/* Nhập lại mật khẩu */}
            <TextInput
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
              style={[
                styles.input,
                errors.confirmPassword && submitCount > 0
                  ? styles.inputError
                  : null,
              ]}
              onChangeText={handleChange("confirmPassword")}
              value={values.confirmPassword}
            />

            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
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
  button: {
    backgroundColor: "#ff2d7a",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  link: { color: "#ff2d7a", marginTop: 15, textAlign: "center" },
  error: { color: "red", fontSize: 13 },
  inputError: {
    borderColor: "#ff4d4f",
    shadowColor: "#ff4d4f",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

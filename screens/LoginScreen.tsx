// src/screens/LoginScreen.tsx
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
import { useDispatch } from "react-redux";
import { LoginValues } from "../types/user";
import { login } from "../store/slices/auth.slice";
import { AppDispatch } from "../store/store";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Bắt buộc nhập tên đăng nhập"),
  password: Yup.string()
    .min(6, "Tối thiểu 6 ký tự")
    .required("Bắt buộc nhập mật khẩu"),
});

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (values: LoginValues) => {
    try {
      await dispatch(login(values)).unwrap();
      // Alert.alert("Thông báo", "Đăng nhập thành công.");
    } catch (error: any) {
      Alert.alert("Thông báo", error.toString());
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default LoginScreen;

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
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  link: { color: "#1e90ff", marginTop: 15, textAlign: "center" },
  error: { color: "red", fontSize: 13 },
});

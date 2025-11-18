import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  ActivityIndicator,
  Modal, // <-- Thêm Modal
  TextInput,
  AppState, // <-- Thêm TextInput
} from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
// Giả định bạn đã thêm hàm verify2FAActivationService vào auth.service.ts
import {
  disableTOTPService,
  enableTOTPService,
  generateSecretService,
  // verify2FAActivationService,
} from "../services/auth.service";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { AppError } from "../types/error";

type ModalPurpose = "ACTIVATE" | "DISABLE" | null;

const TwoFactorAuthScreen: React.FC = () => {
  // Trạng thái 2FA (Đã kích hoạt và được xác minh)
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean | undefined>(false); // Khóa bí mật (chỉ hiển thị khi đang trong quá trình thiết lập)
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uri, setUri] = useState<string>(""); // Key URI (cho QR code) // TRẠNG THÁI MỚI CHO MODAL

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [modalPurpose, setModalPurpose] = useState<ModalPurpose>(null); // State phân biệt mục đích

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    setUri(user?.secret?.uri || "");
    if (user?.secret?.verify)
      setSecretKey(user?.secret?.verify ? null : user?.secret?.value);
    if (user?.secret) setIs2FAEnabled(true);
    console.log(user?.secret);
  }, [user]);

  // Helper để đóng modal và reset state
  const closeModal = () => {
    setIsModalVisible(false);
    setOtpCode("");
    setModalPurpose(null);
  };

  // --- HÀM CHUNG KHI NHẤN NÚT XÁC NHẬN TRONG MODAL ---
  const handleModalAction = () => {
    if (modalPurpose === "ACTIVATE") {
      handleVerifyActivation();
    } else if (modalPurpose === "DISABLE") {
      handleVerifyDisabling();
    }
  };

  const accentColor: string = "#ff2d7a";

  const handleCopySecretKey = useCallback(async () => {
    if (secretKey) {
      await Clipboard.setStringAsync(secretKey);
      Alert.alert(
        "Sao Chép Thành Công",
        "Khóa Bí Mật đã được sao chép vào bộ nhớ tạm."
      );
    }
  }, [secretKey]);

  const handleVerifyDisabling = useCallback(async () => {
    if (otpCode.length !== 6) {
      return Alert.alert("Lỗi", "Vui lòng nhập mã OTP 6 chữ số.");
    }

    setIsLoading(true);
    try {
      // GỌI API BACKEND: Tắt 2FA
      await disableTOTPService(otpCode);

      Alert.alert("Thành Công", "Xác thực 2 Yếu Tố đã được tắt.");
      setIs2FAEnabled(false);
      setSecretKey(null);
      setUri("");
      closeModal(); // Đóng modal và reset state
    } catch (err) {
      const error = err as AppError;
      console.log("otp", error);

      Alert.alert(
        "Lỗi",
        error.message || "Mã OTP không chính xác. Không thể tắt 2FA."
      );
    } finally {
      setIsLoading(false);
    }
  }, [otpCode]);

  // ----------------------------------------------------------------------
  // --- HÀM XỬ LÝ XÁC NHẬN KÍCH HOẠT (QUAN TRỌNG) ---
  const handleVerifyActivation = useCallback(async () => {
    if (otpCode.length !== 6) {
      return Alert.alert("Lỗi", "Vui lòng nhập mã OTP 6 chữ số.");
    }

    setIsLoading(true);
    try {
      // GỌI API BACKEND: Gửi mã OTP lên để xác thực và kích hoạt 2FA
      // await verify2FAActivationService(otpCode);
      await enableTOTPService(otpCode);

      Alert.alert("Thành Công", "Xác thực 2 Yếu Tố đã được kích hoạt!");
      setIs2FAEnabled(true); // Đánh dấu là đã kích hoạt (và xác minh) // ẨN MÃ QR VÀ SECRET (theo yêu cầu)
      setSecretKey(null);
      setUri("");
      setOtpCode("");
      setIsModalVisible(false);
    } catch (error: any) {
      // Xử lý lỗi từ backend (ví dụ: mã OTP sai)
      Alert.alert(
        "Lỗi",
        error.message || "Mã OTP không chính xác hoặc đã hết hạn."
      );
    } finally {
      setIsLoading(false);
    }
  }, [otpCode]); // --- HÀM XỬ LÝ BẬT 2FA ---
  // ----------------------------------------------------------------------

  const handleEnable2FA = useCallback(async () => {
    setIsLoading(true);
    try {
      const { secret, keyUri } = await generateSecretService();

      setSecretKey(secret);

      setUri(keyUri);
      setIs2FAEnabled(true);
      //  // CHƯA BẬT TRƯỚC KHI XÁC MINH
      Alert.alert(
        "Kích Hoạt 2FA",
        "Đã tạo Khóa Bí Mật. Quét/Nhập khóa và nhấn 'Xác Nhận Kích Hoạt'."
      );
    } catch (error) {
      console.error("Lỗi khi bật 2FA:", error);
      Alert.alert("Lỗi", "Không thể tạo Khóa Bí Mật. Vui lòng thử lại.");
      setSecretKey(null);
      setUri("");
    } finally {
      setIsLoading(false);
    }
  }, []); // --- HÀM XỬ LÝ TẮT 2FA ---

  const handleDisable2FA = useCallback(() => {
    Alert.alert(
      "Xác Nhận Tắt 2FA",
      "Bạn có chắc muốn tắt Xác thực 2 Yếu Tố không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác Nhận Tắt",
          onPress: async () => {
            setIsLoading(true);
            try {
              // GỌI API BACKEND: Vô hiệu hóa Secret Key (và có thể yêu cầu mã OTP xác nhận)
              await disableTOTPService("123");

              setIs2FAEnabled(false);
              setSecretKey(null);
              setUri("");
              Alert.alert("Thành Công", "2FA đã được tắt.");
            } catch (error) {
              console.error("Lỗi khi tắt 2FA:", error);
              Alert.alert("Lỗi", "Không thể tắt 2FA. Vui lòng thử lại.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }, []); // Hàm xử lý khi người dùng nhấn nút Switch

  const toggleSwitch = () => {
    if (isLoading) return; // Nếu 2FA đã được bật (is2FAEnabled = true) -> Chuyển sang tắt
    if (is2FAEnabled) {
      if (!user?.secret?.verify) {
        // Nếu 2FA chưa được xác minh thì ko cần nhập QR để tắt
        handleDisable2FA();
      } else {
        setModalPurpose("DISABLE");
        setIsModalVisible(true); // Nếu chưa kích hoạt nhưng đang hiển thị QR (secretKey != null) -> Bỏ qua
      }
    } else if (!is2FAEnabled && secretKey) {
      // Đang chờ xác minh, không cần làm gì
      return;
      // Nếu chưa kích hoạt (is2FAEnabled = false) và chưa có secretKey -> Chuyển sang bật
    } else {
      handleEnable2FA();
    }
  }; // Xác định nội dung hiển thị: // 1. Nếu 2FA đã được kích hoạt (true) HOẶC // 2. Nếu đang chờ xác minh (secretKey có dữ liệu)

  const shouldShowSetup = is2FAEnabled || secretKey;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>Cài Đặt Xác Thực 2 Yếu Tố (2FA)</Text>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>Trạng thái 2FA</Text>
        <Switch
          trackColor={{ false: "#767577", true: accentColor }}
          thumbColor={shouldShowSetup ? "#ffffff" : "#f4f3f4"}
          onValueChange={toggleSwitch} // Chỉ hiện thị là 'Bật' nếu đã xác minh thành công (is2FAEnabled)
          value={is2FAEnabled}
          disabled={isLoading}
        />
      </View>
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={accentColor}
          style={{ marginBottom: 10 }}
        />
      )}
      <Text
        style={[
          styles.statusIndicator,
          { color: is2FAEnabled ? "green" : accentColor },
        ]}
      >
        {is2FAEnabled ? "2FA ĐANG BẬT" : "2FA ĐANG TẮT"}
      </Text>
      {/* --- PHẦN HƯỚNG DẪN THIẾT LẬP (Chỉ hiển thị khi secretKey != null) --- */}
      {secretKey && (
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Bước 1: Đăng ký Khóa Bí Mật</Text>
          {/* Nội dung quét QR / Sao chép Secret Key */}
          <Text style={styles.stepTitle}>
            Cách 1: Quét Mã QR (Dùng thiết bị khác)
          </Text>
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={uri} // Sử dụng OTPAuth URL đầy đủ
              size={180}
              color="#333333"
              backgroundColor="white"
            />
          </View>
          <View style={styles.divider} />
          <Text style={styles.stepTitle}>
            Cách 2: Nhập Thủ Công (Dùng cùng thiết bị)
          </Text>
          <Text style={styles.qrDescription}>
            Nếu bạn chỉ có một điện thoại, hãy sao chép Khóa Bí Mật bên dưới:
          </Text>
          <View style={styles.secretContainer}>
            <Text style={styles.secretKeyText} numberOfLines={1}>
              {secretKey}
            </Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopySecretKey}
            >
              <Text style={styles.copyButtonText}>Sao Chép</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.instructionText}>
            Sau khi quét/nhập, hãy mở ứng dụng Authenticator:
            <Text style={{ fontWeight: "bold" }}>
              chọn dấu cộng (+), 'Nhập khóa thiết lập'
            </Text>
            và dán Khóa Bí Mật đã sao chép.
          </Text>
          {/* Nút mở Modal xác nhận */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              setModalPurpose("ACTIVATE");
              setIsModalVisible(true);
              // handleModalAction();
            }} // <-- Mở Modal
            disabled={isLoading}
          >
            <Text style={styles.confirmButtonText}>
              Bước 2: Xác Nhận Kích Hoạt
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* ---------------------------------------------------------------------- */}
      {/* --------------------------- MODAL NHẬP OTP --------------------------- */}
      {/* ---------------------------------------------------------------------- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>Xác Nhận 2FA</Text>
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
            />

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.buttonClose]}
                onPress={() => setIsModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={modalStyles.textStyle}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: accentColor }]}
                onPress={handleModalAction} // <-- Gọi hàm xác nhận
                disabled={isLoading || otpCode.length !== 6}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={modalStyles.textStyle}>Xác Nhận</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// ----------------------------------------------------------------------
// --- STYLES CHO MODAL ---
// ----------------------------------------------------------------------
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

export default TwoFactorAuthScreen;

// Giữ nguyên Styles gốc
const styles = StyleSheet.create({
  // ... (Giữ nguyên styles chung)
  container: { flex: 1, backgroundColor: "#f5f5f5", marginBottom: 70 },
  contentContainer: { padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
    textAlign: "center",
  },
  statusBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
  },
  statusText: { fontSize: 18, color: "#333333", fontWeight: "600" },
  statusIndicator: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  qrSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff2d7a",
    marginBottom: 15,
    textAlign: "center",
  },
  qrDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 10,
  },
  qrCodeContainer: {
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "white",
  },
  instructionText: {
    marginTop: 15,
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
  },
  confirmButton: {
    backgroundColor: "#ff2d7a",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  confirmButtonText: { color: "white", fontWeight: "bold", fontSize: 16 }, // --- Styles Mới ---
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  divider: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 20 },
  secretContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  secretKeyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff2d7a", // Màu accent để nổi bật Khóa
    marginRight: 10,
  },
  copyButton: {
    backgroundColor: "#333333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  copyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

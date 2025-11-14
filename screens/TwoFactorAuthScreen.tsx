import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard"; // Cần cài đặt thư viện này
import QRCode from "react-native-qrcode-svg";
import { generateSecretService } from "../services/auth.service";

// --- Giả lập Dữ liệu từ Backend ---
// Đây là Khóa Bí Mật (Secret Key) thuần túy
const MOCK_SECRET_KEY: string = "JBSWY3DPEHPK3PXP";
// OTPAuth URL (dùng cho Mã QR)
// const MOCK_QR_DATA: string = `otpauth://totp/TenApp:user@example.com?secret=${MOCK_SECRET_KEY}&issuer=TenApp`;

const TwoFactorAuthScreen: React.FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uri, setUri] = useState<string>("");

  const accentColor: string = "#ff2d7a";

  // --- HÀM SAO CHÉP KHÓA BÍ MẬT ---
  const handleCopySecretKey = useCallback(async () => {
    if (secretKey) {
      await Clipboard.setStringAsync(secretKey);
      Alert.alert(
        "Sao Chép Thành Công",
        "Khóa Bí Mật đã được sao chép vào bộ nhớ tạm."
      );
    }
  }, [secretKey]);

  // --- HÀM XỬ LÝ BẬT 2FA ---
  const handleEnable2FA = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. GỌI API BACKEND để lấy Secret Key (ví dụ: JBSWY3DPEHPK3PXP)
      const { secret, keyUri } = await generateSecretService();

      //   const secret: string = MOCK_SECRET_KEY; // Dữ liệu giả lập nhận từ Backend

      // 2. LƯU KHÓA BÍ MẬT VÀ HIỂN THỊ
      setSecretKey(secret);
      setUri(keyUri);
      setIs2FAEnabled(true);

      Alert.alert(
        "Kích Hoạt 2FA",
        "Đã tạo Khóa Bí Mật. Vui lòng quét Mã QR HOẶC sao chép Khóa Bí Mật vào Google Authenticator để hoàn tất."
      );
    } catch (error) {
      console.error("Lỗi khi bật 2FA:", error);
      Alert.alert("Lỗi", "Không thể tạo Khóa Bí Mật. Vui lòng thử lại.");
      setIs2FAEnabled(false);
      setSecretKey(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- HÀM XỬ LÝ TẮT 2FA ---
  const handleDisable2FA = useCallback(() => {
    // ... (Logic tắt 2FA không thay đổi)
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
              // GỌI API BACKEND: Vô hiệu hóa Secret Key
              setIs2FAEnabled(false);
              setSecretKey(null);
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
  }, []);

  // Hàm xử lý khi người dùng nhấn nút Switch
  const toggleSwitch = () => {
    if (isLoading) return;
    if (is2FAEnabled) {
      handleDisable2FA();
    } else {
      handleEnable2FA();
    }
  };

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
          thumbColor={is2FAEnabled ? "#ffffff" : "#f4f3f4"}
          onValueChange={toggleSwitch}
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
        {is2FAEnabled ? "✅ 2FA ĐANG BẬT" : "⚠️ 2FA ĐANG TẮT"}
      </Text>

      {/* --- PHẦN HƯỚNG DẪN KHI BẬT --- */}
      {is2FAEnabled && secretKey && (
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Bước 1: Đăng ký Khóa Bí Mật</Text>

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

          {/* KHU VỰC KHÓA BÍ MẬT VÀ NÚT SAO CHÉP */}
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
            Sau khi quét/nhập, hãy mở Google Authenticator:{" "}
            <Text style={{ fontWeight: "bold" }}>
              chọn dấu cộng (+) $\rightarrow$ 'Nhập khóa thiết lập'
            </Text>{" "}
            và dán Khóa Bí Mật đã sao chép.
          </Text>

          {/* Nút giả lập cho bước xác nhận cuối cùng */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() =>
              Alert.alert(
                "Xác Nhận",
                "Bước cuối cùng: Nhập mã 6 chữ số từ Authenticator vào đây để xác nhận kích hoạt."
              )
            }
            disabled={isLoading}
          >
            <Text style={styles.confirmButtonText}>
              Bước 2: Xác Nhận Kích Hoạt
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... (Giữ nguyên styles chung)
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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
  confirmButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  // --- Styles Mới ---
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

export default TwoFactorAuthScreen;

import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY =
  "cbd70bef7b65ebff831e0656ffbea49326f1794e4dfd9bd9b41ce47bf8806325";
const REFRESH_TOKEN_KEY =
  "cff990908ae0407c53ed320aea706872a4afb1ffd4ce5a6c913f82107efcb972";

const TokenService = {
  async saveTokens(accessToken: string, refreshToken: string) {
    if (accessToken)
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken)
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  async getAccessToken() {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async deleteTokens() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};

export default TokenService;

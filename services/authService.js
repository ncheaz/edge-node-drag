import CacheService from "./cacheService.js";
import { authenticateToken } from "./userManagementService.js";

class AuthService {
  async authenticateAndCache(cookie) {
    try {
      const { userData, expiresIn } = await authenticateToken(cookie);

      return userData;
    } catch (error) {
      console.error("Error authenticating token:", error);
      throw new Error("Token authentication failed");
    }
  }
}

const authService = new AuthService();
export default authService;

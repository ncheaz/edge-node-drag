import CacheService from "./cacheService.js";
import { authenticateToken } from "./userManagementService.js";

class AuthService {
  async authenticateAndCache(req) {
    try {
      const { userData, expiresIn } = await authenticateToken(req);

      return userData;
    } catch (error) {
      console.error("Error authenticating token:", error);
      throw new Error("Token authentication failed");
    }
  }
}

const authService = new AuthService();
export default authService;

const NodeCache = require("node-cache");

const cache = new NodeCache({
  deleteOnExpire: true, // Automatically delete expired entries
});

class CacheService {
  /**
   * Stores user data in the cache using the provided token as the key.
   *
   * @param {string} token - The unique identifier for the user.
   * @param {object} userData - The user data to be stored in the cache.
   * @param {number} expiresIn - The number of seconds until the cache entry expires.
   *
   * @returns {void}
   */
  cacheToken(token, userData, expiresIn) {
    cache.set(token, userData, expiresIn);
  }

  /**
   * Retrieves user data from the cache using the provided token as the key.
   *
   * @param {string} token - The unique identifier for the user.
   *
   * @returns {object|undefined} The user data associated with the provided token, or undefined if not found.
   */
  getUserData(token) {
    return cache.get(token);
  }

  /**
   * Checks if a token exists in the cache.
   *
   * @param {string} token - The unique identifier for the user.
   *
   * @returns {boolean} Returns true if the token exists in the cache, false otherwise.
   */
  hasToken(token) {
    return cache.has(token);
  }

  /**
   * Clears the token from the cache.
   *
   * @param {string} token - The unique identifier for the user.
   *
   * @returns {void}
   */
  clearToken(token) {
    cache.del(token);
  }
}

const cacheService = new CacheService();

module.exports = cacheService;

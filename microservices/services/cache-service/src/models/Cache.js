const { redisClient } = require('../config/redis');

class Cache {
  static async set(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await redisClient.setEx(key, ttl, serializedValue);
      } else {
        await redisClient.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      throw error;
    }
  }

  static async get(key) {
    try {
      const value = await redisClient.get(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value);
    } catch (error) {
      console.error('Cache get error:', error);
      throw error;
    }
  }

  static async del(key) {
    try {
      const result = await redisClient.del(key);
      return result > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      throw error;
    }
  }

  static async exists(key) {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      throw error;
    }
  }

  static async expire(key, ttl) {
    try {
      const result = await redisClient.expire(key, ttl);
      return result === 1;
    } catch (error) {
      console.error('Cache expire error:', error);
      throw error;
    }
  }

  static async ttl(key) {
    try {
      const result = await redisClient.ttl(key);
      return result;
    } catch (error) {
      console.error('Cache TTL error:', error);
      throw error;
    }
  }

  static async keys(pattern = '*') {
    try {
      const keys = await redisClient.keys(pattern);
      return keys;
    } catch (error) {
      console.error('Cache keys error:', error);
      throw error;
    }
  }

  static async flushAll() {
    try {
      await redisClient.flushAll();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      throw error;
    }
  }

  static async mget(keys) {
    try {
      const values = await redisClient.mGet(keys);
      return values.map(value => value ? JSON.parse(value) : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      throw error;
    }
  }

  static async mset(keyValuePairs, ttl = null) {
    try {
      const serializedPairs = {};
      for (const [key, value] of Object.entries(keyValuePairs)) {
        serializedPairs[key] = JSON.stringify(value);
      }

      await redisClient.mSet(serializedPairs);

      if (ttl) {
        const promises = Object.keys(serializedPairs).map(key =>
          redisClient.expire(key, ttl)
        );
        await Promise.all(promises);
      }

      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      throw error;
    }
  }

  static async increment(key, value = 1) {
    try {
      const result = await redisClient.incrBy(key, value);
      return result;
    } catch (error) {
      console.error('Cache increment error:', error);
      throw error;
    }
  }

  static async decrement(key, value = 1) {
    try {
      const result = await redisClient.decrBy(key, value);
      return result;
    } catch (error) {
      console.error('Cache decrement error:', error);
      throw error;
    }
  }

  // Hash operations
  static async hset(key, field, value) {
    try {
      const serializedValue = JSON.stringify(value);
      const result = await redisClient.hSet(key, field, serializedValue);
      return result;
    } catch (error) {
      console.error('Cache hset error:', error);
      throw error;
    }
  }

  static async hget(key, field) {
    try {
      const value = await redisClient.hGet(key, field);
      if (value === null) {
        return null;
      }
      return JSON.parse(value);
    } catch (error) {
      console.error('Cache hget error:', error);
      throw error;
    }
  }

  static async hgetall(key) {
    try {
      const hash = await redisClient.hGetAll(key);
      const result = {};
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value);
      }
      return result;
    } catch (error) {
      console.error('Cache hgetall error:', error);
      throw error;
    }
  }

  static async hdel(key, field) {
    try {
      const result = await redisClient.hDel(key, field);
      return result > 0;
    } catch (error) {
      console.error('Cache hdel error:', error);
      throw error;
    }
  }
}

module.exports = Cache;

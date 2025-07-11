const Cache = require('../models/Cache');

class CacheController {
  static async setValue(req, res) {
    try {
      const { key, value, ttl } = req.body;
      
      await Cache.set(key, value, ttl);
      
      res.status(201).json({
        success: true,
        message: 'Value cached successfully',
        data: { key, ttl: ttl || 'no expiration' }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to cache value',
        error: error.message
      });
    }
  }

  static async getValue(req, res) {
    try {
      const { key } = req.params;
      
      const value = await Cache.get(key);
      
      if (value === null) {
        return res.status(404).json({
          success: false,
          message: 'Key not found'
        });
      }
      
      const ttl = await Cache.ttl(key);
      
      res.json({
        success: true,
        data: {
          key,
          value,
          ttl: ttl === -1 ? 'no expiration' : `${ttl} seconds`
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve value',
        error: error.message
      });
    }
  }

  static async deleteValue(req, res) {
    try {
      const { key } = req.params;
      
      const deleted = await Cache.del(key);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Key not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Key deleted successfully',
        data: { key }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete key',
        error: error.message
      });
    }
  }

  static async checkExists(req, res) {
    try {
      const { key } = req.params;
      
      const exists = await Cache.exists(key);
      
      res.json({
        success: true,
        data: {
          key,
          exists
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to check key existence',
        error: error.message
      });
    }
  }

  static async setExpiration(req, res) {
    try {
      const { key } = req.params;
      const { ttl } = req.body;
      
      const updated = await Cache.expire(key, ttl);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Key not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Expiration set successfully',
        data: { key, ttl }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to set expiration',
        error: error.message
      });
    }
  }

  static async getKeys(req, res) {
    try {
      const { pattern = '*' } = req.query;
      
      const keys = await Cache.keys(pattern);
      
      res.json({
        success: true,
        data: {
          pattern,
          keys,
          count: keys.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve keys',
        error: error.message
      });
    }
  }

  static async getMultipleValues(req, res) {
    try {
      const { keys } = req.body;
      
      if (!Array.isArray(keys)) {
        return res.status(400).json({
          success: false,
          message: 'Keys must be an array'
        });
      }
      
      const values = await Cache.mget(keys);
      
      const result = {};
      keys.forEach((key, index) => {
        result[key] = values[index];
      });
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve multiple values',
        error: error.message
      });
    }
  }

  static async setMultipleValues(req, res) {
    try {
      const { keyValuePairs, ttl } = req.body;
      
      if (typeof keyValuePairs !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'keyValuePairs must be an object'
        });
      }
      
      await Cache.mset(keyValuePairs, ttl);
      
      res.status(201).json({
        success: true,
        message: 'Multiple values cached successfully',
        data: {
          keys: Object.keys(keyValuePairs),
          count: Object.keys(keyValuePairs).length,
          ttl: ttl || 'no expiration'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to cache multiple values',
        error: error.message
      });
    }
  }

  static async incrementValue(req, res) {
    try {
      const { key } = req.params;
      const { value = 1 } = req.body;
      
      const result = await Cache.increment(key, value);
      
      res.json({
        success: true,
        message: 'Value incremented successfully',
        data: {
          key,
          newValue: result,
          incrementBy: value
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to increment value',
        error: error.message
      });
    }
  }

  static async decrementValue(req, res) {
    try {
      const { key } = req.params;
      const { value = 1 } = req.body;
      
      const result = await Cache.decrement(key, value);
      
      res.json({
        success: true,
        message: 'Value decremented successfully',
        data: {
          key,
          newValue: result,
          decrementBy: value
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to decrement value',
        error: error.message
      });
    }
  }

  static async flushCache(req, res) {
    try {
      await Cache.flushAll();
      
      res.json({
        success: true,
        message: 'Cache flushed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to flush cache',
        error: error.message
      });
    }
  }

  // Hash operations
  static async setHashField(req, res) {
    try {
      const { key, field, value } = req.body;
      
      await Cache.hset(key, field, value);
      
      res.status(201).json({
        success: true,
        message: 'Hash field set successfully',
        data: { key, field }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to set hash field',
        error: error.message
      });
    }
  }

  static async getHashField(req, res) {
    try {
      const { key, field } = req.params;
      
      const value = await Cache.hget(key, field);
      
      if (value === null) {
        return res.status(404).json({
          success: false,
          message: 'Hash field not found'
        });
      }
      
      res.json({
        success: true,
        data: {
          key,
          field,
          value
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get hash field',
        error: error.message
      });
    }
  }

  static async getAllHashFields(req, res) {
    try {
      const { key } = req.params;
      
      const hash = await Cache.hgetall(key);
      
      res.json({
        success: true,
        data: {
          key,
          fields: hash,
          count: Object.keys(hash).length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get hash fields',
        error: error.message
      });
    }
  }

  static async deleteHashField(req, res) {
    try {
      const { key, field } = req.params;
      
      const deleted = await Cache.hdel(key, field);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Hash field not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Hash field deleted successfully',
        data: { key, field }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete hash field',
        error: error.message
      });
    }
  }
}

module.exports = CacheController;

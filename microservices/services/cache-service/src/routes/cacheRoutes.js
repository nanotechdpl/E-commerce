const express = require('express');
const CacheController = require('../controllers/cacheController');
const validate = require('../middleware/validation');

const router = express.Router();

// Basic cache operations
router.post('/', validate.setValue, CacheController.setValue);
router.get('/:key', CacheController.getValue);
router.delete('/:key', CacheController.deleteValue);
router.get('/:key/exists', CacheController.checkExists);
router.patch('/:key/expire', validate.setExpiration, CacheController.setExpiration);

// Batch operations
router.get('/', CacheController.getKeys);
router.post('/mget', validate.getMultipleValues, CacheController.getMultipleValues);
router.post('/mset', validate.setMultipleValues, CacheController.setMultipleValues);

// Numeric operations
router.patch('/:key/increment', CacheController.incrementValue);
router.patch('/:key/decrement', CacheController.decrementValue);

// Hash operations
router.post('/hash', validate.setHashField, CacheController.setHashField);
router.get('/hash/:key/:field', CacheController.getHashField);
router.get('/hash/:key', CacheController.getAllHashFields);
router.delete('/hash/:key/:field', CacheController.deleteHashField);

// Admin operations
router.delete('/', CacheController.flushCache);

module.exports = router;

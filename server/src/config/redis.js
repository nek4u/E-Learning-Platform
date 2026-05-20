import Redis from 'ioredis';
import logger from '../utils/logger.js';

let redis = null;

export const getRedis = () => {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) {
    logger.warn('Redis URL not set — caching disabled');
    return null;
  }
  try {
    redis = new Redis(url, { maxRetriesPerRequest: 3, lazyConnect: true });
    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.warn(`Redis error: ${err.message}`));
    return redis;
  } catch (err) {
    logger.warn(`Redis init failed: ${err.message}`);
    return null;
  }
};

export const cacheGet = async (key) => {
  const client = getRedis();
  if (!client) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, value, ttl = 300) => {
  const client = getRedis();
  if (!client) return;
  try {
    await client.setex(key, ttl, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

export const cacheDel = async (pattern) => {
  const client = getRedis();
  if (!client) return;
  try {
    const keys = await client.keys(pattern);
    if (keys.length) await client.del(...keys);
  } catch {
    /* ignore */
  }
};

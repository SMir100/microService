// src/services/redis.js
const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryStrategy(times) {
    // reconnect every 2 seconds
    return Math.min(times * 50, 2000);
  }
});

// Connection events
redis.on("connect", () => {
  console.log("🟢 Connected to Redis");
});

redis.on("ready", () => {
  console.log("⚡ Redis is ready");
});

redis.on("error", (err) => {
  console.error("🔴 Redis error:", err);
});

redis.on("reconnecting", () => {
  console.log("🟡 Reconnecting to Redis...");
});

module.exports = redis;

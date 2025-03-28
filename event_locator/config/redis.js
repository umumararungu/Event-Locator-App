const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD })
});

// Promisify Redis methods for async/await usage
client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);
client.delAsync = promisify(client.del).bind(client);
client.publishAsync = promisify(client.publish).bind(client);
client.subscribeAsync = promisify(client.subscribe).bind(client);

// Error handling
client.on('error', (error) => {
  console.error('Redis error:', error);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = client;
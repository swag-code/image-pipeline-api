const { Queue } = require("bullmq");
const IORedis = require("ioredis");
const { redisUrl } = require("../config/env");

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

const requestQueue = new Queue("requestQueue", { connection });
const imageQueue = new Queue("imageQueue", { connection });

module.exports = { requestQueue, imageQueue, connection };

require("dotenv").config();
module.exports = {
  port: process.env.PORT || 8000,
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  storageBackend: process.env.STORAGE_BACKEND || "local",
  basePublicUrl: process.env.BASE_PUBLIC_URL || "http://localhost:8000",
  localUploadDir: process.env.LOCAL_UPLOAD_DIR || "./uploads",
  s3: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
  },
};

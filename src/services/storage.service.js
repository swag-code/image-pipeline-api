const fs = require('fs');
const path = require('path');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { storageBackend, basePublicUrl, localUploadDir, s3 } = require('../config/env');

let s3Client = null;
if (storageBackend === 's3') s3Client = new S3Client({ region: s3.region });

async function saveBytes(requestId, fileName, buffer, contentType) {
  if (storageBackend === 'local') {
    const dir = path.resolve(process.cwd(), localUploadDir, requestId);
    fs.mkdirSync(dir, { recursive: true });
    const full = path.join(dir, fileName);
    fs.writeFileSync(full, buffer);
    return `${basePublicUrl}/static/${requestId}/${fileName}`;
  } else {
    const Key = `${requestId}/${fileName}`;
    await s3Client.send(new PutObjectCommand({ Bucket: s3.bucket, Key, Body: buffer, ContentType: contentType }));
    return `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/${Key}`;
  }
}

module.exports = { saveBytes };

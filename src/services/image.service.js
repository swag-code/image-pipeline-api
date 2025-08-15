const axios = require('axios');
const sharp = require('sharp');
const storage = require('./storage.service');

async function downloadCompressStore({ requestId, inputUrl, position }) {
  const resp = await axios.get(inputUrl, { responseType: 'arraybuffer', timeout: 15000, maxContentLength: 50 * 1024 * 1024 });
  let pipeline = sharp(Buffer.from(resp.data));
  const metadata = await pipeline.metadata();

  // normalize to jpeg with ~50% quality
  const outBuffer = await pipeline.jpeg({ quality: 50 }).toBuffer();

  const fileName = `img-${Date.now()}-${position || 0}.jpg`;
  return storage.saveBytes(requestId, fileName, outBuffer, 'image/jpeg');
}

module.exports = { downloadCompressStore };

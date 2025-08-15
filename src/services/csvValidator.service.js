const { parse } = require('csv-parse');
const streamifier = require('streamifier');
const Request = require('../db/models/Request');
const Product = require('../db/models/Product');
const Image = require('../db/models/Image');

const URL_RE = /^https?:\/\/.+/i;

async function parseAndPersist({ buffer, requestId }) {
  return new Promise((resolve, reject) => {
    const parser = parse({ columns: true, trim: true, skip_empty_lines: true });
    const products = [];
    let rowIdx = 1;

    parser.on('readable', () => {
      let record;
      while ((record = parser.read())) {
        rowIdx++;
        const sNo = Number(record['S. No.'] ?? record['S. No'] ?? record['Serial Number']);
        const name = record['Product Name'];
        const inputCol = record['Input Image Urls'];
        if (!Number.isInteger(sNo) || !name || !inputCol) {
          return reject(new Error(`Invalid row ${rowIdx}`));
        }
        const urls = inputCol.split(',').map(u => u.trim()).filter(Boolean);
        if (urls.length === 0 || urls.some(u => !URL_RE.test(u))) {
          return reject(new Error(`Invalid URLs at row ${rowIdx}`));
        }
        products.push({ sNo, name, urls });
      }
    });

    parser.on('end', async () => {
      try {
        let total = 0;
        for (const p of products) {
          const prod = await Product.create({ requestId, serialNo: p.sNo, productName: p.name });
          p.urls.forEach((u, i) => {
            total++;
            Image.create({ requestId, productId: prod._id, inputUrl: u, position: i });
          });
        }
        await Request.updateOne({ requestId }, { totalItems: total });
        resolve({ total });
      } catch (e) { reject(e); }
    });

    parser.on('error', reject);
    const stream = streamifier.createReadStream(buffer);
    stream.pipe(parser);
  });
}

module.exports = { parseAndPersist };

const { Parser } = require('json2csv');
const Product = require('../db/models/Product');
const Image = require('../db/models/Image');
const storage = require('./storage.service');

async function generate(requestId) {
  const products = await Product.find({ requestId }).sort({ serialNo: 1 }).lean();
  const rows = [];

  for (const p of products) {
    const imgs = await Image.find({ requestId, productId: p._id }).sort({ position: 1 }).lean();
    rows.push({
      'S. No.': p.serialNo,
      'Product Name': p.productName,
      'Input Image Urls': imgs.map(i => i.inputUrl).join(','),
      'Output Image Urls': imgs.map(i => i.outputUrl || '').join(',')
    });
  }

  const parser = new Parser({ fields: ['S. No.','Product Name','Input Image Urls','Output Image Urls'] });
  const csv = parser.parse(rows);
  const url = await storage.saveBytes(requestId, 'output.csv', Buffer.from(csv, 'utf8'), 'text/csv');
  return url;
}

module.exports = { generate };

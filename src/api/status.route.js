const router = require('express').Router();
const Request = require('../db/models/Request');
const Product = require('../db/models/Product');
const Image = require('../db/models/Image');

router.get('/status/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const r = await Request.findOne({ requestId }).lean();
  if (!r) return res.status(404).json({ error: 'Not found' });

  const products = await Product.find({ requestId }).sort({ serialNo: 1 }).lean();
  const result = [];
  for (const p of products) {
    const imgs = await Image.find({ requestId, productId: p._id }).sort({ position: 1 }).lean();
    result.push({
      serialNo: p.serialNo,
      productName: p.productName,
      images: imgs.map(i => ({ inputUrl: i.inputUrl, outputUrl: i.outputUrl, status: i.status }))
    });
  }
  res.json({
    requestId,
    status: r.status,
    totalItems: r.totalItems,
    processedItems: r.processedItems,
    failedItems: r.failedItems,
    outputCsvUrl: r.outputCsvUrl || null,
    products: result
  });
});

module.exports = router;

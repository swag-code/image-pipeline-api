const router = require('express').Router();
const multer = require('multer');
const streamifier = require('streamifier');
const { requestQueue } = require('../jobs/queues');
const { parseAndPersist } = require('../services/csvValidator.service');
const Request = require('../db/models/Request');
const { randomUUID } = require('crypto');

const upload = multer();

router.post('/upload', upload.single('file'), async (req, res) => {
  let requestId;
  try {
    if (!req.file) return res.status(400).json({ error: 'CSV file required as "file"' });

    requestId = randomUUID();
    const webhookUrl = req.body.webhook_url || null;

    await Request.create({ requestId, status: 'VALIDATING', webhookUrl });

    await parseAndPersist({ buffer: req.file.buffer, requestId });

    await Request.updateOne({ requestId }, { status: 'QUEUED' });
    await requestQueue.add('processRequest', { requestId });

    return res.status(201).json({ requestId, status: 'QUEUED' });
  } catch (e) {
    if (requestId) {
      await Request.updateOne({ requestId }, { status: 'FAILED', error: String(e.message || e) }).catch(()=>{});
    }
    return res.status(400).json({ error: String(e.message || e) });
  }
});

module.exports = router;

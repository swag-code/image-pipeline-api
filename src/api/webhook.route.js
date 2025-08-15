const router = require('express').Router();
router.post('/webhook/test-receiver', (req, res) => {
  console.log('Webhook received:', req.body);
  res.json({ ok: true });
});
module.exports = router;

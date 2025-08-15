const axios = require('axios');
async function notifyCompletion({ requestId, status, outputCsvUrl }) {
  const url = process.env.WEBHOOK_URL;
  if (!url) return;
  try {
    await axios.post(url, {
      event: 'request.completed',
      requestId, status, outputCsvUrl,
      completedAt: new Date().toISOString()
    }, { timeout: 8000 });
  } catch (e) {
    // swallow webhook errors
  }
}
module.exports = { notifyCompletion };

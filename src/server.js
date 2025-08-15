const app = require('./config/express');
const connect = require('./db/connection');
const { port } = require('./config/env');

(async () => {
  await connect();
  app.listen(port, () => console.log(`API listening on :${port}`));
})();

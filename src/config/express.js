const express = require('express');
const path = require('path');
const uploadRoutes = require('../api/upload.route');
const statusRoutes = require('../api/status.route');
const webhookRoutes = require('../api/webhook.route');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use('/static', express.static(path.resolve(process.cwd(), 'uploads')));
app.use('/api/v1', uploadRoutes);
app.use('/api/v1', statusRoutes);
app.use('/api/v1', webhookRoutes);
app.get('/health', (_, res) => res.json({ ok: true }));

module.exports = app;

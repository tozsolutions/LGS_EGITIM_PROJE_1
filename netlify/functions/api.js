const serverless = require('serverless-http');
const express = require('express');
const app = require('../../dist/server/app.js').default;

// Create Express app instance
const server = express();
server.use('/.netlify/functions/api', app);

// Export as serverless function
module.exports.handler = serverless(server);
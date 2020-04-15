/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const mongoose = require('mongoose');
// Security headers
const { apiResponseHeaders, swaggerUIHeaders } = require('./security-headers');
const sitemap = require('./controllers/Sitemap');
// const wiki = require('./controllers/wiki');

require('./config');

// App
const app = express();

// Constants
const PORT = 9191;
const HOST = '0.0.0.0';

// DB
mongoose.Promise = global.Promise;
mongoose.connect(
  `${process.env.MONGODB_URI_PREFIX}://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}`,
  { useNewUrlParser: true }
);
mongoose.connection.on('error', () => {
  throw new Error('Mongodb Connection Error!');
});

// CORS Settings
const whitelist = process.env.WHITELIST_CORS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      return callback(null, true);
    }
    return callback('Bad Request');
  },
};
app.use(cors(corsOptions));

app.use('/sitemap.xml', sitemap);
// app.use('/wiki', wiki);
// Swagger
// swaggerRouter configuration
const options = {
  controllers: path.join(__dirname, './controllers'),
};

// Swagger UI docs
const spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);
// Initialize the Swagger middleware

// Set security headers to API responses
app.use(apiResponseHeaders);

swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Log requests to the console.
  app.use(logger('dev'));

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  const swaggerui = process.env.SWAGGER_UI === 'true' || false;
  if (swaggerui) {
    // Set security headers to Swagger docs
    app.use(swaggerUIHeaders);
    app.use(middleware.swaggerUi());
  }

  // Start the server
  app.listen(PORT, HOST);
  console.log(
    'Your server is listening on port %d (http://localhost:%d)',
    PORT,
    PORT
  );
  if (swaggerui) {
    console.log('Swagger-ui is available on http://localhost:%d/docs', PORT);
  }
});

// export app
module.exports = app;

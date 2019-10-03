import express from 'express';
import { json, urlencoded } from 'body-parser';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import config from './config';
import cors from 'cors';
import url from 'url';
export const app = express();

// Removing x-powered-by header improves security
app.disable('x-powered-by');

// Enforce common middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

// Declare proxy for orders api
const orderApiProxy = proxy(`${config.orderApiUrl}/api/orders`, {
  proxyReqPathResolver: req => url.parse(req.baseUrl).path
});

// Declare proxy for payments api
const paymentApiProxy = proxy(`${config.paymentApiUrl}/api/payments`, {
  proxyReqPathResolver: req => url.parse(req.baseUrl).path
});

// Mount reservation routes
app.use('/api/orders?/?*', orderApiProxy);

// Mount bonus points routes
app.use('/api/payments?/?*', paymentApiProxy);

// Start the express server for the Gateway
export const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

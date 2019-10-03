import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import config from './config';
import cors from 'cors';
import { connectDb } from './utils/db';
import { authenticate } from './utils/auth';
import { messagingBrokerInitialization } from './utils/messaging';
import ordersRouter from './resources/orders/orders.router';
import { orderPaidEventEmitter } from './utils/eventEmitters';
import { changeStatusToConfirmed } from './resources/orders/orders.eventHandlers';
export const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/', authenticate);
app.use('/api/orders', ordersRouter);

orderPaidEventEmitter.on('order-paid-event-caught', async message => {
  // Update order status to confirmed
  await changeStatusToConfirmed(JSON.parse(message)).catch(error => {
    console.error(error);
  });
});

export const start = async () => {
  try {
    await connectDb();
    await messagingBrokerInitialization();
    app.listen(config.port, () => {
      console.log(`Order API on http://localhost:${config.port}/api/orders/`);
    });
  } catch (e) {
    console.error(e);
  }
};

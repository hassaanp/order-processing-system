import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import config from './config';
import cors from 'cors';
import { protect } from './utils/auth';
import { connectDb } from './utils/db';
import { messagingBrokerInitialization } from './utils/messaging';
import ordersRouter from './resources/orders/orders.router';
import { paymentProcessedEventEmitter } from './utils/eventEmitters';
import {
  changeStatusToConfirmed,
  changeStatusToDeclined,
  orderDelivered
} from './resources/orders/orders.eventHandlers';
export const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', protect);
app.use('/api/orders', ordersRouter);

paymentProcessedEventEmitter.on(
  'payment-processed-event-caught',
  async message => {
    let parsedMessage = JSON.parse(message);
    if (parsedMessage.status == 'paid') {
      await changeStatusToConfirmed(parsedMessage).catch(error => {
        console.error(error);
      });
      setTimeout(() => {
        orderDelivered(parsedMessage);
      }, 60000);
    } else {
      await changeStatusToDeclined(parsedMessage).catch(error => {
        console.error(error);
      });
    }
  }
);

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

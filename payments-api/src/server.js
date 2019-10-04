import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import config from './config';
import cors from 'cors';
import { protect } from './utils/auth';
import { connectDb } from './utils/db';
import { messagingBrokerInitialization } from './utils/messaging';
import { paymentCreateEventEmitter } from './utils/eventEmitters';
import { createPayment } from './resources/payments.eventHandlers';
import PaymentRouter from './resources/payments.router';

export const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', protect);
app.use('/api/payments', PaymentRouter);

paymentCreateEventEmitter.on('payment-create-event-caught', async message => {
  // Create payment
  await createPayment(JSON.parse(message)).catch(error => {
    console.error(error);
  });
});

export const start = async () => {
  try {
    await connectDb();
    await messagingBrokerInitialization();
    app.listen(config.port, () => {
      console.log(
        `Payments API on http://localhost:${config.port}/api/payments/`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

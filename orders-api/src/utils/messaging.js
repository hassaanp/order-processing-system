import config from '../config';
import amqlib from 'amqplib';
import {
  paymentCreateEventEmitter,
  orderPaidEventEmitter
} from './eventEmitters';

export const messagingBrokerInitialization = async () => {
  try {
    let messagingBroker = await amqlib.connect(config.rabbitmqUrl);
    let orderChannel = await messagingBroker.createChannel();
    await orderChannel.assertQueue(config.orderConfirmedEvent);
    orderChannel.consume(config.orderConfimredEvent, msg => {
      if (msg !== null) {
        let parsedMessage = msg.content.toString();
        console.log(parsedMessage);
        orderPaidEventEmitter.emit('order-paid-event-caught', parsedMessage);
        orderChannel.ack(msg);
      }
    });
    let paymentChannel = await await messagingBroker.createChannel();
    await paymentChannel.assertQueue(config.paymentCreateEvent);
    paymentCreateEventEmitter.on('order-created', message => {
      paymentChannel.sendToQueue(
        config.paymentCreateEvent,
        Buffer.from(message)
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

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
    orderPaidEventEmitter.on('payment-successful', message => {
      orderChannel.sendToQueue(
        config.orderConfirmedEvent,
        Buffer.from(message)
      );
    });
    let paymentChannel = await messagingBroker.createChannel();
    await paymentChannel.assertQueue(config.paymentCreateEvent);
    paymentChannel.consume(config.paymentCreateEvent, msg => {
      if (msg !== null) {
        let parsedMessage = msg.content.toString();
        console.log(parsedMessage);
        paymentCreateEventEmitter.emit(
          'payment-create-event-caught',
          parsedMessage
        );
        paymentChannel.ack(msg);
      }
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

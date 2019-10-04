import config from '../config';
import amqlib from 'amqplib';
import {
  paymentCreateEventEmitter,
  paymentProcessedEventEmitter
} from './eventEmitters';

export const messagingBrokerInitialization = async () => {
  try {
    let messagingBroker = await amqlib.connect(config.rabbitmqUrl);
    let paymentProcessedChannel = await messagingBroker.createChannel();
    await paymentProcessedChannel.assertQueue(config.paymentProcessedEvent);
    paymentProcessedChannel.consume(config.paymentProcessedEvent, msg => {
      if (msg !== null) {
        let parsedMessage = msg.content.toString();
        console.log(parsedMessage);
        paymentProcessedEventEmitter.emit(
          'payment-processed-event-caught',
          parsedMessage
        );
        paymentProcessedChannel.ack(msg);
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

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
    paymentProcessedEventEmitter.on('payment-processed', message => {
      paymentProcessedChannel.sendToQueue(
        config.paymentProcessedEvent,
        Buffer.from(message)
      );
    });
    let paymentCreateChannel = await messagingBroker.createChannel();
    await paymentCreateChannel.assertQueue(config.paymentCreateEvent);
    paymentCreateChannel.consume(config.paymentCreateEvent, msg => {
      if (msg !== null) {
        let parsedMessage = msg.content.toString();
        console.log(parsedMessage);
        paymentCreateEventEmitter.emit(
          'payment-create-event-caught',
          parsedMessage
        );
        paymentCreateChannel.ack(msg);
      }
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

import config from '../config';
import amqlib from 'amqplib';
import { paymentCreateEventEmitter } from './eventEmitters';

export const messagingBrokerInitialization = async () => {
  try {
    // let messagingBroker =
    await amqlib.connect(config.rabbitmqUrl);
    let channel = await messagingBroker.createChannel();
    await channel.assertQueue(config.bonusPointsUpdateEvent);
    channel.consume(config.paymentCreateEvent, msg => {
      if (msg !== null) {
        let parsedMessage = msg.content.toString();
        console.log(parsedMessage);
        paymentCreateEventEmitter.emit(
          'payment-create-event-caught',
          parsedMessage
        );
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

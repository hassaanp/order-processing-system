import { Payments } from './payments.model';

export async function createPayment(eventBody) {
  try {
    if (
      eventBody &&
      eventBody.orderId &&
      eventBody.createdBy &&
      eventBody.bill
    ) {
      delete eventBody.status;
      let created = await Payments.create(eventBody);
      if (created) {
        return created;
      } else {
        throw new Error('unable to create the payment');
      }
    } else {
      throw new Error('event body is malformed');
    }
  } catch (error) {
    throw error;
  }
}

import { Orders } from './orders.model';

export async function changeStatusToConfirmed(eventBody) {
  try {
    if (eventBody && eventBody.orderId) {
      let updatedDoc = await Orders.findByIdAndUpdate(eventBody.orderId, {
        status: 'confirmed'
      })
        .lean()
        .exec();
      if (updatedDoc) {
        return true;
      } else {
        throw new Error('could not confirm the order');
      }
    } else {
      throw new Error('event body is malformed');
    }
  } catch (error) {
    throw error;
  }
}

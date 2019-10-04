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

export async function changeStatusToDeclined(eventBody) {
  try {
    if (eventBody && eventBody.orderId) {
      let updatedDoc = await Orders.findByIdAndUpdate(eventBody.orderId, {
        status: 'declined'
      })
        .lean()
        .exec();
      if (updatedDoc) {
        return true;
      } else {
        throw new Error('could not decline the order');
      }
    } else {
      throw new Error('event body is malformed');
    }
  } catch (error) {
    throw error;
  }
}

export async function orderDelivered(eventBody) {
  try {
    let updatedDoc = await Orders.findByIdAndUpdate(eventBody.orderId, {
      status: 'delivered'
    })
      .lean()
      .exec();
    if (updatedDoc) {
      console.info(`order ${eventBody.orderId} has been delivered`);
      return true;
    } else {
      throw new Error('order delivery failed');
    }
  } catch (error) {
    console.error(error);
  }
}

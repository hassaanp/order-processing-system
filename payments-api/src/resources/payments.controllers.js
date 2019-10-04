import { Payments } from './payments.model';
import { crudControllers } from './../utils/crud';
import { payWithCreditCard } from './../utils/payment';
import { paymentProcessedEventEmitter } from '../utils/eventEmitters';

let initiatePayment = async (req, res) => {
  try {
    let paymentDoc = await Payments.findOne({
      orderId: req.params.id,
      createdBy: req.user.id
    });
    if (!paymentDoc || paymentDoc.processed) {
      return res
        .status(404)
        .send('payment already processed or does not exist');
    }
    const paid = await payWithCreditCard(
      req.body.creditCardDetails,
      paymentDoc.bill
    );
    paymentDoc.processed = true;
    paymentDoc.status = paid ? 'paid' : 'declined';
    await paymentDoc.save({ new: true }, error => {
      if (error) {
        console.error(error);
        throw new Error('could not complete the payment');
      }
    });
    paymentProcessedEventEmitter.emit(
      'payment-processed',
      JSON.stringify(paymentDoc.toJSON())
    );
    if (paid) {
      res.status(200).send('payment was successful');
    } else {
      res.status(400).send('payment was declined');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send('payment could not be processed at this time');
  }
};

export default {
  initiatePayment,
  ...crudControllers(Payments)
};

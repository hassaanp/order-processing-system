import { Payments } from './payments.model';
import { crudControllers } from './../utils/crud';
import { payWithCreditCard } from './../utils/payment';
import { orderPaidEventEmitter } from '../utils/eventEmitters';

let initiatePayment = async (req, res) => {
  try {
    let paymentDoc = await Payments.findById(req.params.id)
      .lean()
      .exec();
    if (!paymentDoc || paymentDoc.paid) {
      return res
        .status(400)
        .send('payment already processed or does not exist');
    }
    const paid = await payWithCreditCard(
      req.body.creditCardDetails,
      paymentDoc.bill
    );
    if (paid) {
      let updatedDoc = await Payments.findByIdAndUpdate(
        req.params.id,
        { paid: true },
        { new: true }
      )
        .lean()
        .exec();
      if (!updatedDoc) {
        return res.status(400).send('could not update payment status');
      }
      orderPaidEventEmitter.emit(
        'payment-successful',
        JSON.stringify(paymentDoc)
      );
      res.status(200).send('payment was successful');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send('payment was unsuccessful');
  }
};

export default {
  initiatePayment,
  ...crudControllers(Payments)
};

import mongoose from 'mongoose';

let paymentsSchema = new mongoose.Schema(
  {
    bill: {
      type: Number,
      default: 0
    },
    orderId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'orders'
    },
    paid: {
      type: Boolean
    },
    userId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

paymentsSchema.post('validate', doc => {
  doc.paid = false;
});

export let Payments = mongoose.model('payments', paymentsSchema);

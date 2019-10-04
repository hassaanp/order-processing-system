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
    processed: {
      type: Boolean
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'declined']
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

paymentsSchema.post('validate', doc => {
  if (!doc.status) {
    doc.processed = false;
    doc.status = 'pending';
  }
});

export let Payments = mongoose.model('payments', paymentsSchema);

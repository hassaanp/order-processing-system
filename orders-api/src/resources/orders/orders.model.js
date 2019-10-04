import mongoose from 'mongoose';
import { paymentCreateEventEmitter } from '../../utils/eventEmitters';

let ordersSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['created', 'confirmed', 'cancelled', 'declined', 'delivered']
    },
    bill: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

ordersSchema.post('validate', doc => {
  doc.status = 'created';
});

ordersSchema.post('save', doc => {
  console.info('emitting create payment event', doc);
  paymentCreateEventEmitter.emit(
    'order-created',
    JSON.stringify({ ...doc.toJSON(), orderId: doc._id })
  );
});

export const Orders = mongoose.model('orders', ordersSchema);

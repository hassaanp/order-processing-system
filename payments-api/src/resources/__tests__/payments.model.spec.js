import { Payments } from '../payments.model';
import mongoose from 'mongoose';

describe('Payments model', () => {
  describe('schema', () => {
    test('orderId', () => {
      const orderId = Payments.schema.obj.orderId;
      expect(orderId).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'orders'
      });
    });
    test('bill', () => {
      const bill = Payments.schema.obj.bill;
      expect(bill).toEqual({
        type: Number,
        default: 0
      });
    });
    test('status', () => {
      const status = Payments.schema.obj.status;
      expect(status).toEqual({
        type: String,
        enum: ['pending', 'paid', 'declined']
      });
    });
    test('processed', () => {
      const status = Payments.schema.obj.processed;
      expect(status).toEqual({
        type: Boolean
      });
    });
    test('createdBy', () => {
      const createdBy = Payments.schema.obj.createdBy;
      expect(createdBy).toEqual({
        type: String,
        required: true
      });
    });
  });
});

import { Orders } from '../orders.model';

describe('Orders model', () => {
  describe('schema', () => {
    test('createdBy', () => {
      const createdBy = Orders.schema.obj.createdBy;
      expect(createdBy).toEqual({
        type: String,
        required: true
      });
    });
    test('bill', () => {
      const bill = Orders.schema.obj.bill;
      expect(bill).toEqual({
        type: Number,
        required: true,
        default: 0
      });
    });
    test('status', () => {
      const status = Orders.schema.obj.status;
      expect(status).toEqual({
        type: String,
        enum: ['created', 'confirmed', 'cancelled', 'declined', 'delivered']
      });
    });
  });
});

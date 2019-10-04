import controllers from '../payments.controllers';
import { isFunction } from 'lodash';

describe('payments controllers', () => {
  test('has crud controllers', () => {
    const crudMethods = [
      'create',
      'get',
      'getAll',
      'update',
      'removeOne',
      'initiatePayment'
    ];

    crudMethods.forEach(name =>
      expect(isFunction(controllers[name])).toBe(true)
    );
  });
});

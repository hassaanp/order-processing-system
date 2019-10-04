import controllers from '../orders.controllers';
import { isFunction } from 'lodash';

describe('orders controllers', () => {
  test('has crud controllers', () => {
    const crudMethods = [
      'create',
      'get',
      'getAll',
      'update',
      'removeOne',
      'cancelOrder'
    ];

    crudMethods.forEach(name =>
      expect(isFunction(controllers[name])).toBe(true)
    );
  });
});

import { Router } from 'express';
import paymentsControllers from './payments.controllers';

let router = Router();

router.route('/').get(paymentsControllers.getAll);

router.route('/:id').get(paymentsControllers.get);

router.route('/pay/:id').post(paymentsControllers.initiatePayment);

export default router;

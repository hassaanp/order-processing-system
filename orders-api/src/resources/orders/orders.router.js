import controllers from './orders.controllers';
import { Router } from 'express';

let router = Router();

router
  .route('/')
  .get(controllers.getAll)
  .post(controllers.create);

router
  .route('/:id')
  .get(controllers.get)
  .delete(controllers.cancelOrder);

export default router;

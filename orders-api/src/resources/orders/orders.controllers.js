import { Orders } from './orders.model';
import { crudControllers } from '../../utils/crud';

let cancelOrder = async (req, res) => {
  try {
    let cancelled = await Orders.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled'
      },
      { new: true }
    );
    res.status(200).json({ data: cancelled });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export default {
  cancelOrder,
  ...crudControllers(Orders)
};

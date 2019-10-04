import { Orders } from './orders.model';
import { crudControllers } from '../../utils/crud';

let cancelOrder = async (req, res) => {
  try {
    let cancelled = await Orders.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      {
        status: 'cancelled'
      },
      { new: true }
    );
    if (!cancelled) {
      return res.status(404).end();
    }
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

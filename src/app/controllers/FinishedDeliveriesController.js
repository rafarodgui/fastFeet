import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class FinishedDeliveriesController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        end_date: { [Op.not]: null },
      },
    });

    return res.json(orders);
  }
}

export default new FinishedDeliveriesController();

import { Op } from 'sequelize';
import Order from '../models/Order';

class EndDeliveryController {
  async index(req, res) {
    const { deliveryman_id } = req.params;
    const { page = 1 } = req.query;

    const endedDeliveries = await Order.findAll({
      where: {
        deliveryman_id,
        end_date: { [Op.not]: null },
        start_date: { [Op.not]: null },
        canceled_at: null,
      },
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(endedDeliveries);
  }

  async update(req, res) {
    const { delivery_id } = req.params;
    const { deliveryman_id } = req.body;

    const delivery = await Order.findOne({
      where: {
        deliveryman_id,
        id: delivery_id,
        start_date: { [Op.not]: null },
      },
    });

    if (!delivery) {
      return res
        .status(400)
        .json({ error: 'delivery not found, or is not started' });
    }

    const { end_date } = await delivery.update(req.body);

    return res.json(end_date);
  }
}

export default new EndDeliveryController();

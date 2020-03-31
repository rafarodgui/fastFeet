import * as Yup from 'yup';
import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';

class DeliveryProblemsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const delivery = await Order.findByPk(id, {
      attributes: [
        'deliveryman_id',
        'recipient_id',
        'product',
        'start_date',
        'end_date',
        'canceled_at',
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'No delivery found' });
    }

    const { description } = await DeliveryProblems.create(req.body);

    return res.json({ delivery, description });
  }

  async index(req, res) {
    const { id } = req.params;

    const delivery = await Order.findByPk(id, {
      attributes: [
        'deliveryman_id',
        'recipient_id',
        'product',
        'start_date',
        'end_date',
        'canceled_at',
      ],
    });
    const deliveryProblems = await DeliveryProblems.findAll({
      where: { delivery_id: id },
      attributes: ['id', 'description'],
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery does not found' });
    }

    if (deliveryProblems.length <= 0) {
      return res
        .status(401)
        .json({ error: "This delivery don't have any problems" });
    }

    return res.json({ delivery, deliveryProblems });
  }
}

export default new DeliveryProblemsController();

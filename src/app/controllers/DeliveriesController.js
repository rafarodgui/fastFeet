import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveriesController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const orders = await Order.findAll({
      where: { canceled_at: null, end_date: null, deliveryman_id: id },
      attributes: ['id', 'product', 'recipient_id', 'start_date', 'end_date'],
      order: ['id'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'nome',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
            'signature_id',
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const delivery = await Order.findOne({
      where: {
        id,
        canceled_at: null,
        start_date: null,
        end_date: null,
      },
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'nome',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
            'signature_id',
          ],
        },
      ],
    });

    if (!delivery) {
      return res.json({ error: 'Ops, no deliveries here' });
    }

    await delivery.update(req.body);

    return res.json({ delivery });
  }
}

export default new DeliveriesController();

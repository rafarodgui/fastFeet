import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class OrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const {
      product,
      recipient_id,
      deliveryman_id,
      signature_id,
    } = await Order.create(req.body);

    return res.json(recipient_id, deliveryman_id, signature_id, product);
  }

  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'recipient_id', 'deliveryman_id'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email', 'avatar_id'],
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
}

export default new OrdersController();

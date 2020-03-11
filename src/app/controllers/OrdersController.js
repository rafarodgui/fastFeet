import * as Yup from 'yup';
import { isBefore } from 'date-fns';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Notification from '../schema/Notification';

class OrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      canceled_at: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, recipient_id } = req.body;
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    const recipient = await Recipient.findByPk(recipient_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const { product, signature_id } = await Order.create(req.body);

    /**
     * Notify deliveryman
     */

    await Notification.create({
      content: `Dear ${deliveryman.name}, you have a ${product} to delivey to ${recipient.nome}`,
      deliveryman_id,
    });

    return res.json({ product, recipient, deliveryman, signature_id });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const orders = await Order.findAll({
      where: { canceled_at: null, end_date: null },
      attributes: [
        'id',
        'product',
        'recipient_id',
        'deliveryman_id',
        'start_date',
        'end_date',
      ],
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email', 'avatar_id'],
          include: [
            { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
          ],
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
      deliveryman_id: Yup.number(),
      product: Yup.string(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const { id } = req.params;

    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email', 'avatar_id'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
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

    const { start_date, end_date } = req.body;

    if (isBefore(start_date, new Date()) || isBefore(end_date, new Date())) {
      return res.json({ error: 'past dates are not permitted' });
    }

    const { deliveryman_id, product } = await order.update(req.body);

    return res.json({
      deliveryman_id,
      product,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    order.canceled_at = new Date();

    order.save();

    return res.json(order);
  }
}

export default new OrdersController();

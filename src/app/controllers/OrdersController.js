import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

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

    return res.json({ product, recipient_id, deliveryman_id, signature_id });
  }

  async index(req, res) {
    const { id } = req.params;

    if (id) {
      const orders = await Order.findAll({
        where: { canceled_at: null, end_date: null, deliveryman_id: id },
        attributes: ['id', 'product', 'recipient_id', 'start_date', 'end_date'],
        order: ['id'],
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

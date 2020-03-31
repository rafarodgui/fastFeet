import * as Yup from 'yup';
import {
  setHours,
  parseISO,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveriesController {
  async index(req, res) {
    const { deliveryman_id } = req.params;
    const { page = 1 } = req.query;

    const delivery = await Order.findAll({
      where: { canceled_at: null, end_date: null, deliveryman_id },
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
          ],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'No delivery found' });
    }

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails' });
    }

    const { deliveryman_id, delivery_id } = req.params;
    const { start_date } = req.body;

    const delivery = await Order.findOne({
      where: {
        deliveryman_id,
        id: delivery_id,
        canceled_at: null,
        start_date: null,
        end_date: null,
      },
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'canceled_at',
        'deliveryman_id',
        'recipient_id',
        'signature_id',
      ],
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
          ],
        },
      ],
    });

    if (!delivery) {
      return res.json({ error: 'Ops, no deliveries here' });
    }

    const firstHour = setHours(startOfDay(new Date()), 8);
    const lastHour = setHours(startOfDay(new Date()), 18);

    /**
     * Deliveryman can just start a delivery between 8am and 6pm
     */
    if (
      isBefore(parseISO(start_date), firstHour) ||
      isAfter(parseISO(start_date), lastHour)
    ) {
      return res.status(400).json({ error: 'Invalid time' });
    }

    const deliveryLimit = await Order.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    if (deliveryLimit.length >= 5) {
      return res.status(400).json({ error: 'Deliveries limit are reached' });
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new DeliveriesController();

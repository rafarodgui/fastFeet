import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class FinishedDeliveriesController {
  async index(req, res) {
    const { id } = req.params;
    const { page } = req.query;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const finishedDeliveries = await Order.findAll({
      where: {
        deliveryman_id: id,
        end_date: { [Op.not]: null },
      },
      attributes: [
        'id',
        'product',
        'recipient_id',
        'deliveryman_id',
        'start_date',
        'end_date',
      ],
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
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
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'url', 'path'],
        },
      ],
    });

    return res.json(finishedDeliveries);
  }
}

export default new FinishedDeliveriesController();

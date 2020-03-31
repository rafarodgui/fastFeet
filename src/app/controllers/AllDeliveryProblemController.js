import DeliveryProblem from '../models/DeliveryProblems';
import Order from '../models/Order';

class AllDeliveryProblemController {
  async index(req, res) {
    const deliveriesProblem = await DeliveryProblem.findAll({
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: ['id', 'deliveryman_id', 'product'],
        },
      ],
    });

    return res.json(deliveriesProblem);
  }
}

export default new AllDeliveryProblemController();

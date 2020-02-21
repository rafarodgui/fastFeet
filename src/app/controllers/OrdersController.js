import * as Yup from 'yup';
import Orders from '../models/Orders';

class OrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      canceled_at: Yup.boolean(),
      start_date: Yup.boolean(),
      end_date: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    return res.json({ ok: 'true' });
  }
}

export default new OrdersController();

import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validatioon fails' });
    }

    const { name, email } = await Deliveryman.create(req.body);

    return res.json({ name, email });
  }

  async index(req, res) {
    const deliveryman = await Deliveryman.findAll();

    return res.json({ deliveryman });
  }
}

export default new DeliverymanController();

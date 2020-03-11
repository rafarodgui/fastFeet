import Notification from '../schema/Notification';
import Deliveryman from '../models/Deliveryman';

class NotificationController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const notifications = await Notification.find({
      deliveryman_id: id,
    })
      .sort('createdAt')
      .limit(15);

    return res.json(notifications);
  }
}

export default new NotificationController();

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({ error: 'This user does not exists' });
    }

    if (!(await admin.checkPassword(password))) {
      return res.status(401).json({ error: 'password does not match' });
    }

    const { id, nome } = admin;

    return res.json({
      admin: { email, id, nome },
      token: jwt.sign({ id }, 'd6f622d75899a8aefec0f9d3e30b1308', {
        expiresIn: '7d',
      }),
    });
  }
}

export default new SessionController();

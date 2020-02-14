import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({ Error: 'This user does not exists' });
    }

    if (!(await admin.checkPassword(password))) {
      return res.status(401).json({ Error: 'password does not match' });
    }

    const { id, nome } = admin;

    return res.json({
      admin: { email, id, nome },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

import * as Yup from 'yup';
import Recipients from '../models/Recipients';

class RecipientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.string().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ Error: 'check the data and try again' });
    }

    const recipientExists = await Recipients.findOne({
      where: {
        nome: req.body.nome,
      },
    });

    if (recipientExists) {
      return res.status(401).json({ Error: 'this recipient already exists' });
    }

    const {
      nome,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    } = await Recipients.create(req.body);

    return res.json({ nome, rua, numero, complemento, estado, cidade, cep });
  }

  async index(req, res) {
    const recipients = await Recipients.findAll();

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'there is no recipients' });
    }

    return res.json(recipients);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ Error: 'Missing data, try again' });
    }

    const { nome } = req.body;

    const { id } = req.params;

    const recipient = await Recipients.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ Error: 'Recipient not found' });
    }

    if (nome !== recipient.nome) {
      const recipientExists = await Recipients.findOne({ where: { nome } });

      if (recipientExists) {
        return res.status(401).json({ Error: 'This name is already in use' });
      }
    }
    const {
      rua,
      numero,
      coplemento,
      estado,
      cidade,
      cep,
    } = await recipient.update(req.body);

    return res.json({ nome, rua, numero, coplemento, estado, cidade, cep });
  }
}

export default new RecipientsController();

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancellation',
      context: {
        deliverymanName: deliveryman.name,
        recipientName: recipient.nome,
        rua: recipient.rua,
        estado: recipient.estado,
      },
    });
  }
}

export default new CancellationMail();

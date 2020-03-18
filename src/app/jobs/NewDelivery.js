import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'NewDelivery';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;

    console.log('Tudo ok');

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Você tem uma nova encomenda!',
      template: 'newDelivery',
      context: {
        deliverymanName: deliveryman.name,
        recipientName: recipient.nome,
        city: recipient.cidade,
        product,
      },
    });
  }
}

export default new NewDelivery();

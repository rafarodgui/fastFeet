import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Admin from '../app/models/Admin';
import Recipient from '../app/models/Recipient';
import Deliveryman from '../app/models/Deliveryman';
import Order from '../app/models/Order';
import File from '../app/models/File';

const models = [Admin, Recipient, Deliveryman, File, Order];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model =>
        model.associate ? model.associate(this.connection.models) : null
      );
  }
}

export default new Database();

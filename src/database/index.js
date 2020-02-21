import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Admin from '../app/models/Admin';
import Recipients from '../app/models/Recipients';
import Deliveryman from '../app/models/Deliveryman';
import Orders from '../app/models/Orders';
import File from '../app/models/File';

const models = [Admin, Recipients, Deliveryman, File, Orders];

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

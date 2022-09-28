dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      accquire: dbConfig.pool.accquire,
      idle: dbConfig.pool.idle
    }
  }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.categories = require('./categories.model')(sequelize, Sequelize);
db.products = require('./products/products.model')(sequelize, Sequelize);
db.dimensions = require('./products/dimensions.model')(sequelize, Sequelize);
//relationship
db.products.belongsToMany(db.dimensions, {
  through: 'product_dimension',
  as: 'dimension',
  foreignKey: 'product_id'
});
db.dimensions.belongsToMany(db.products, {
  through: 'product_dimension',
  as: 'product',
  foreignKey: 'dimension_id'
});


module.exports = db;

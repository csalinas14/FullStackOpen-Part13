const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'session',
  }
)

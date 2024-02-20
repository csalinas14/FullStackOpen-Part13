const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

const year = new Date().getFullYear()

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1991,
          msg: 'Year cannot be below 1991',
        },
        max: {
          args: year,
          msg: 'Year cannot be above current year',
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog',
  }
)

module.exports = Blog

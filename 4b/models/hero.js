'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Hero extends Model {
    static associate(models) {
      Hero.belongsTo(models.Type, { foreignKey: "type_id", as: "type" });
      Hero.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
  }

  Hero.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "type_tb",
          key: "id",
        },
      },
      photo: {
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users_tb",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: 'Hero',
      tableName: 'hero_tb',
      timestamps: true,
    }
  );

  return Hero;
};

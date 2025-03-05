'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      Type.hasMany(models.Hero, { foreignKey: "type_id", as: "heroes" });
    }
  }

  Type.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Type',
      tableName: 'type_tb',
      timestamps: true,
    }
  );

  return Type;
};

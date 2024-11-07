const { Model } = require('sequelize');

/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize/types')} DataTypes
 */

/**
 * @param {DataTypes} DataTypes
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize, DataTypes) => {
  class FreeSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FreeSchedule.belongsTo(models.User, {
        as: 'userOwnerSchedule',
        foreignKey: 'owner',
      });
      FreeSchedule.belongsTo(models.User, {
        as: 'userResponsibleSchedule',
        foreignKey: 'responsible',
      });
    }
  }
  FreeSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      dateStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      comments: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FreeSchedule',
      tableName: "FreeSchedules",
      timestamps: true,
      paranoid: false,
    }
  );
  return FreeSchedule;
};

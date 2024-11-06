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
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mounth: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      day: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      hstart: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      mstart: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      hend: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      mend: {
        type: DataTypes.TINYINT.UNSIGNED,
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

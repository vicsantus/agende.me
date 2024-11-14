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
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        as: 'userProfile',
        foreignKey: 'user',
      });
    }
  }
  Profile.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      profile: {
        type: DataTypes.STRING(300),
        allowNull: false,
        defaultValue: ' ',
      },
      tags: {
        type: DataTypes.STRING(90),
        allowNull: false,
        defaultValue: '[]',
        get() {
          const rawValue = this.getDataValue('tags');
          return JSON.parse(rawValue);
        },
        set(value) {
          if (Array.isArray(value)) {
            this.setDataValue('tags', JSON.stringify(value));
          } else {
            this.setDataValue('tags', value);
          }
        }
      },
    },
    {
      sequelize,
      modelName: 'Profile',
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCreate(profile) {
          profile.tags = profile.tags ? JSON.stringify(profile.tags) : '[]';
        },
        beforeUpdate(profile) {
          profile.tags = profile.tags ? JSON.stringify(profile.tags) : '[]';
        },
      },
    }
  );
  return Profile;
};

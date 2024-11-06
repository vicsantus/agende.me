
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FreeSchedules', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      owner: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      responsible: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mounth: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      day: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      hstart: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      mstart: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      hend: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      mend: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('FreeSchedules');
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'photo', {
      type: Sequelize.STRING,
      allowNull: true, // Mettez à true ou false selon vos besoins
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'photo');
  },
};

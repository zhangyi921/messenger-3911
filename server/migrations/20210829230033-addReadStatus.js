'use strict';

module.exports = {
  /**
   * @typedef {import('sequelize').Sequelize} Sequelize
   * @typedef {import('sequelize').QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'messages',
      'readByRecipient',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    ).then(() => {
      // set existing records to true, otherwise when users logs in will see millions of unread messages.
      return queryInterface.sequelize.query('UPDATE public.messages SET "readByRecipient"= true')
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'messages',
      'readByRecipient'
    );
  }
};

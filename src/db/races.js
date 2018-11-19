'use strict';

const knex = require('./knex');

module.exports = {
  fetch() {
    return knex('races')
      .select()
      .orderBy('id', 'desc');
  },
};

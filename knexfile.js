'use strict';

// Update with your config settings.

const common = {
  client: 'pg',
  pool: { min: 1, max: 2 },
};

module.exports = {
  development: {
    ...common,
    connection: process.env.DATABASE_URL || 'postgres://localhost/endurance_strategy',
  },

  test: {
    ...common,
    connection:
      process.env.TEST_DATABASE_URL || 'postgres://localhost/endurance-strategy_test',
  },

  production: {
    ...common,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    },
    pool: { min: 2, max: 4 },
  },
};

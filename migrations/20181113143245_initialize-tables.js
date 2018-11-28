'use strict';

function up(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('races', (table) => {
      table.increments('id');
      table.text('name');
      table.text('location');
    }),

    knex.schema.createTable('entries', (table) => {
      table.increments('id');
      table.integer('car_number');
      table.text('manufacturer');
      table.text('class');
      table.integer('race_id');
      table
        .foreign('race_id')
        .references('id')
        .inTable('races')
        .onDelete('CASCADE');
    }),

    knex.schema.createTable('drivers', (table) => {
      table.increments('id');
      table.text('name');
    }),

    knex.schema.createTable('entries_drivers', (table) => {
      table.integer('entry_id');
      table.integer('driver_id');

      table
        .foreign('entry_id')
        .references('id')
        .inTable('entries')
        .onDelete('CASCADE');
      table
        .foreign('driver_id')
        .references('id')
        .inTable('drivers')
        .onDelete('CASCADE');
      table.unique(['entry_id', 'driver_id']);
    }),

    knex.schema.createTable('laps', (table) => {
      table.integer('entry_id');
      table.integer('lap_number').unsigned();
      table.integer('driver_id');
      table.float('lap_time', 8, 3);
      table.integer('position_overall').unsigned();
      table.integer('position_class').unsigned();

      table
        .foreign('entry_id')
        .references('id')
        .inTable('entries')
        .onDelete('CASCADE');
      table
        .foreign('driver_id')
        .references('id')
        .inTable('drivers')
        .onDelete('SET NULL');
      table.primary(['entry_id', 'lap_number']);
    }),

    knex.schema.createTable('pit_stops', (table) => {
      table.integer('entry_id');
      table.integer('lap_in').unsigned();
      table.integer('lap_out').unsigned();
      table.float('time_in_lane', 8, 3);

      table
        .foreign('entry_id')
        .references('id')
        .inTable('entries')
        .onDelete('CASCADE');
      table.primary(['entry_id', 'lap_in']);
    }),

    knex.schema.createTable('cautions', (table) => {
      table.integer('race_id');
      table
        .text('flag_type')
        .defaultTo('YELLOW_FLAG')
        .notNullable();
      table.integer('lap_start').unsigned();
      table.integer('lap_end').unsigned();
      table.timestamp('time_start');
      table.timestamp('time_end');

      table
        .foreign('race_id')
        .references('id')
        .inTable('races')
        .onDelete('CASCADE');
      table.primary(['race_id', 'lap_start']);
    }),
  ]);
}

function down(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('cautions'),
    knex.schema.dropTableIfExists('laps'),
    knex.schema.dropTableIfExists('pit_stops'),
    knex.schema.dropTableIfExists('entries_drivers'),
    knex.schema.dropTableIfExists('entries'),
    knex.schema.dropTableIfExists('drivers'),
    knex.schema.dropTableIfExists('races'),
  ]);
}

module.exports = {
  up,
  down,
};

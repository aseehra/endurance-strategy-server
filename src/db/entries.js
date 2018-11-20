'use strict';

const knex = require('./knex');

module.exports = {
  averageLapTime(entryId) {
    return knex('laps')
      .avg({ averageLapTime: 'lap_time' })
      .where('entry_id', entryId);
  },

  fastestLap(entryId) {
    return knex('laps')
      .where('entry_id', entryId)
      .andWhere(
        'lap_time',
        knex('laps')
          .where('entry_id', entryId)
          .min('lap_time'),
      )
      .join('drivers', 'drivers.id', 'driver_id')
      .select({
        driverName: 'drivers.name',
        lapNumber: 'lap_number',
        lapTime: 'lap_time',
      })
      .orderBy('lap_number')
      .limit(1);
  },
};

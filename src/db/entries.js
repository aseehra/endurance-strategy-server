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

  pitStops(entryId) {
    return knex('pit_stops')
      .where('pit_stops.entry_id', entryId)
      .join('laps', (join) => {
        join
          .on('laps.lap_number', 'lap_in')
          .andOn('laps.entry_id', 'pit_stops.entry_id');
      })
      .join('drivers', 'drivers.id', 'laps.driver_id')
      .select({
        entryId: 'pit_stops.entry_id',
        lapIn: 'lap_in',
        lapout: 'lap_out',
        timeInLane: 'time_in_lane',
        driverId: 'drivers.id',
        driverName: 'drivers.name',
      });
  },
};

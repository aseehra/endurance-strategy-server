'use strict';

const knex = require('./knex');

module.exports = {
  averageLapTime(entryId) {
    return knex('laps')
      .avg({ averageLapTime: 'lap_time' })
      .where('entry_id', entryId)
      .then(([{ averageLapTime }]) => parseFloat(averageLapTime));
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
      .limit(1)
      .then(([fastestLap]) => fastestLap);
  },

  pitStops(entryId) {
    return knex('pit_stops')
      .where('pit_stops.entry_id', entryId)
      .join('laps', (join) => {
        join
          .on('laps.lap_number', 'lap_in')
          .andOn('laps.entry_id', 'pit_stops.entry_id');
      })
      .orderBy('lap_in')
      .select({
        lapIn: 'lap_in',
        lapOut: 'lap_out',
        timeInLane: 'time_in_lane',
      });
  },

  stintData(entryId) {
    let stintBoundaries;
    return Promise.all([
      this.pitStops(entryId),
      knex('laps')
        .where('entry_id', entryId)
        .max({ lastLap: 'lap_number' }),
    ])
      .then(([pitStops, [{ lastLap }]]) => {
        stintBoundaries = pitStops.reduce(
          (acc, pitStop) => {
            const stint = acc[acc.length - 1];
            stint.end = pitStop.lapIn;
            acc.push({ start: pitStop.lapOut });
            return acc;
          },
          [{ start: 1 }],
        );
        stintBoundaries[stintBoundaries.length - 1].end = lastLap;

        // TODO: Think about stint boundraries as it relates to in-/out-laps
        return Promise.all(
          stintBoundaries.map(boundary => knex('laps')
            .where('entry_id', entryId)
            .andWhereBetween('lap_number', [boundary.start, boundary.end])
            .join('drivers', 'drivers.id', 'driver_id')
            .groupBy('drivers.id', 'drivers.name')
            .min({ fastestLapTime: 'lap_time' })
            .avg({ averageLapTime: 'lap_time' })
            .select({ driverId: 'drivers.id', driverName: 'drivers.name' })),
        );
      })
      .then(stintStats => stintStats.map(([stintInfo], index) => ({
        ...stintInfo,
        stintStart: stintBoundaries[index].start,
        stintEnd: stintBoundaries[index].end,
        averageLapTime: parseFloat(stintInfo.averageLapTime),
      })));
  },

  driverData(entryId) {
    return knex('laps')
      .join('drivers', 'drivers.id', 'laps.driver_id')
      .where('laps.entry_id', entryId)
      .groupBy('drivers.id', 'drivers.name')
      .min({ fastestLapTime: 'lap_time' })
      .avg({ averageLapTime: 'lap_time' })
      .select({ driverId: 'drivers.id', driverName: 'drivers.name' })
      .then(rawData => rawData.map(driver => ({
        ...driver,
        averageLapTime: parseFloat(driver.averageLapTime),
      })));
  },
};

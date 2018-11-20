'use strict';

const knex = require('./knex');

module.exports = {
  fetch() {
    return knex('races')
      .select()
      .orderBy('id', 'desc');
  },

  fetchEntries(id) {
    return knex('entries')
      .where('race_id', id)
      .join('laps', (join) => {
        join
          .on('entries.id', 'laps.entry_id')
          /*
           * This should be efficient enough since the primary key on laps is
           * [entry_id, lap_number]
           */
          .andOn(
            'laps.lap_number',
            '=',
            knex.raw('(SELECT MAX(lap_number) FROM laps WHERE entry_id = entries.id)'),
          );
      })
      .column(
        { id: 'entries.id' },
        { carNumber: 'car_number' },
        'class',
        'manufacturer',
        { positionOverall: 'position_overall' },
        { positionInClass: 'position_class' },
      )
      .select()
      .orderBy('position_overall', 'asc');
  },
};

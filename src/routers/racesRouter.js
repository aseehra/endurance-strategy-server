'use strict';

const { Router } = require('express');

const races = require('../db/races');

const router = new Router();

router.get('/', (req, res, next) => {
  races
    .fetch()
    .then((allRaces) => {
      const serialized = allRaces.map(race => ({
        ...race,
        links: {
          entries: `${req.baseUrl}/${race.id}/entries`,
        },
      }));
      res.json({ races: serialized });
    })
    .catch(next);
});

router.get('/:id/entries', (req, res, next) => {
  const { id } = req.params;
  races
    .fetchEntries(id)
    .then((entries) => {
      if (!entries.length) {
        next();
        return;
      }

      const serialized = entries.map(entry => ({
        ...entry,
        links: { statistics: `/api/statistics/entry/${entry.id}` },
      }));

      res.json({ raceId: id, entries: serialized });
    })
    .catch(next);
});

module.exports = router;

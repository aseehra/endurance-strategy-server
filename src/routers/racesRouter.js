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
          self: `${req.baseUrl}/${race.id}`,
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
      const serialized = entries.map(entry => ({
        ...entry,
        links: { self: `${req.baseUrl}/${id}/entries/${entry.id}` },
      }));

      res.json({ entries: serialized });
    })
    .catch(next);
});

module.exports = router;

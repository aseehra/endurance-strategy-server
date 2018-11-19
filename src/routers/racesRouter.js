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
        links: { self: `${req.baseUrl}/${race.id}` },
      }));
      res.json({ races: serialized });
    })
    .catch(next);
});

module.exports = router;

'use strict';

const { Router } = require('express');

const entries = require('../db/entries');

const router = new Router();

router.get('/entry/:entryId', (req, res, next) => {
  const { entryId } = req.params;
  Promise.all([
    entries.fastestLap(entryId),
    entries.averageLapTime(entryId),
    entries.pitStops(entryId),
  ])
    .then(([[fastestLap], [{ averageLapTime }], pitStops]) => {
      res.json({
        entryId,
        fastestLap,
        averageLapTime,
        pitStops,
      });
    })
    .catch(next);
});

router.get('/entry/:entryId/stops', (req, res, next) => {
  const { entryId } = req.params;
  entries
    .pitStops(entryId)
    .then((pitStops) => {
      res.json({ entryId, pitStops });
    })
    .catch(next);
});

router.get('/entry/:entryId/stints', (req, res, next) => {
  const { entryId } = req.params;
  entries
    .stintData(entryId)
    .then(data => res.json({ entryId, data }))
    .catch(next);
});

module.exports = router;

'use strict';

const { Router } = require('express');

const entries = require('../db/entries');

const router = new Router();

router.get('/entry/:entryId', (req, res, next) => {
  const { entryId } = req.params;
  const baseUrl = `${req.baseUrl}/entry/${entryId}`;
  Promise.all([
    entries.averageLapTime(entryId),
    entries.fastestLap(entryId),
    entries.pitStops(entryId),
    entries.driverData(entryId),
  ])
    .then(([averageLapTime, fastestLap, pitStops, driverData]) => {
      res.json({
        entryId,
        fastestLap,
        averageLapTime,
        pitStops,
        driverData,
        links: {
          pitStops: `${baseUrl}/stops`,
          stints: `${baseUrl}/stints`,
          drivers: `${baseUrl}/drivers`,
        },
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
    .then(stints => res.json({ entryId, stints }))
    .catch(next);
});

router.get('/entry/:entryId/drivers', (req, res, next) => {
  const { entryId } = req.params;
  entries
    .driverData(entryId)
    .then(driverStatistics => res.json({ entryId, driverStatistics }))
    .catch(next);
});

module.exports = router;

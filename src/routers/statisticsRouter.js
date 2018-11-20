'use strict';

const { Router } = require('express');

const entries = require('../db/entries');

const router = new Router();

router.get('/entry/:entryId', (req, res, next) => {
  const { entryId } = req.params;
  Promise.all([entries.fastestLap(entryId), entries.averageLapTime(entryId)])
    .then(([[fastestLap], [{ averageLapTime }]]) => {
      res.json({
        entryId,
        fastestLap,
        averageLapTime,
      });
    })
    .catch(next);
});

module.exports = router;

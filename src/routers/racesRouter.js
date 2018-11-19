'use strict';

const { Router } = require('express');

const router = new Router();

router.route('/').get((req, res) => {
  const hardcoded = {
    races: [
      {
        id: 1,
        name: 'Weathertech Sportscars Petit Lemons',
        location: 'Atlanta',
        links: {
          self: `${req.baseUrl}/1`,
        },
      },
    ],
  };
  res.json(hardcoded);
});

module.exports = router;

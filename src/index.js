'use strict';

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const racesRouter = require('./routers/racesRouter');
const { PORT, CLIENT_ORIGIN } = require('../config');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: () => process.env.NODE_ENV === 'test',
  }),
);

app.use(cors({ origin: CLIENT_ORIGIN }));

app.use('/api/races/', racesRouter);

/* eslint-disable no-console */
function main(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', (err) => {
      console.error('Express failed to start');
      console.error(err);
    });
}
/* eslint-enable no-console */

if (require.main === module) {
  main();
}

module.exports = { app };

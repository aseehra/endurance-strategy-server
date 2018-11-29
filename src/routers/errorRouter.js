/* eslint-disable no-console */

'use strict';

const { Router } = require('express');

const router = new Router();

router.use((req, res, next) => {
  const err = new Error('Resource not found');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ ...err, message: err.message });
  }

  console.error(err);
  return res.status(500).json({ status: 500, message: 'Internal server error' });
});

module.exports = router;

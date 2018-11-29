'use strict';

const request = require('supertest');

const knex = require('../db/knex');
const { app } = require('../..');

describe('/api/statistics', () => {
  afterAll(() => knex.destroy());

  const baseUri = '/api/statistics/entry';

  describe('/entry/:id', () => {
    it('should return 404 for an unknown entry id', () => request(app)
      .get(`${baseUri}/404`)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, message: 'Resource not found' });
      }));
  });

  describe('/entry/:id/stops', () => {
    it('should return 404 for an unknown entry id', () => request(app)
      .get(`${baseUri}/404/stops`)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, message: 'Resource not found' });
      }));
  });

  describe('/entry/:id/stints', () => {
    it('should return 404 for an unknown entry id', () => request(app)
      .get(`${baseUri}/404/stints`)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, message: 'Resource not found' });
      }));
  });

  describe('/entry/:id/drivers', () => {
    it('should return 404 for an unknown entry id', () => request(app)
      .get(`${baseUri}/404/drivers`)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, message: 'Resource not found' });
      }));
  });
});

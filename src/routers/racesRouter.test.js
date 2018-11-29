'use strict';

const request = require('supertest');

const knex = require('../db/knex');
const { app } = require('../../');

describe('/api/races', () => {
  const raceSeeds = [
    { id: 1, name: 'Race 1', location: 'Location 1' },
    { id: 2, name: 'Race 2', location: 'Location 2' },
  ];

  afterAll(() => knex.destroy());

  describe('/', () => {
    const url = '/api/races/';
    it('should return all the races', () => knex('races')
      .insert(raceSeeds)
      .then(() => request(app)
        .get(url)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.races).toMatchObject(raceSeeds.reverse());
        }))
      .then(() => knex('races').del()));

    it('should return an empty array of races when no races exist', () => request(app)
      .get(url)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.races).toHaveLength(0);
      }));
  });

  describe('/:id/entries', () => {
    beforeAll(() => knex('races').insert(raceSeeds));
    afterAll(() => knex('races').del());

    const baseUrl = '/api/races';

    it('should return 404 for an unknown race', () => request(app)
      .get(`${baseUrl}/544/entries`)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, message: 'Resource not found' });
      }));
  });
});

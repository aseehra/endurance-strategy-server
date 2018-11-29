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
    const entries = [
      {
        id: 1,
        race_id: 1,
        car_number: 1,
        class: 'P1',
        manufacturer: 'Nissan',
      },
      {
        id: 2,
        race_id: 1,
        car_number: 2,
        class: 'P1',
        manufacturer: 'Toyota',
      },
    ];

    const drivers = [
      { id: 1, name: 'Pipo Derani' },
      { id: 2, name: 'Fernando Alonso' },
    ];

    const lastLaps = [
      {
        entry_id: 1,
        lap_number: '200',
        driver_id: 1,
        lap_time: 90,
        position_overall: 1,
        position_class: 1,
      },
      {
        entry_id: 2,
        lap_number: '199',
        driver_id: 2,
        lap_time: 95,
        position_overall: 2,
        position_class: 2,
      },
    ];

    beforeAll(() => knex('races')
      .insert(raceSeeds)
      .then(() => knex('entries').insert(entries))
      .then(() => knex('drivers').insert(drivers))
      .then(() => knex('entries_drivers').insert(
        { entry_id: 1, driver_id: 1 },
        { entry_id: 2, driver_id: 2 },
      ))
      .then(() => knex('laps').insert(lastLaps)));

    afterAll(() => Promise.all([knex('races').del(), knex('drivers').del()]));

    const baseUrl = '/api/races';

    it('should return 404 for an unknown race', () => request(app)
      .get(`${baseUrl}/544/entries`)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, message: 'Resource not found' });
      }));

    it('should return all entries', () => request(app)
      .get(`${baseUrl}/1/entries`)
      .expect(200)
      .then((res) => {
        expect(res.body.raceId).toBe('1');
        expect(res.body.entries).toMatchObject([
          {
            id: 1,
            carNumber: 1,
            carClass: 'P1',
            positionOverall: 1,
            positionInClass: 1,
            driverName: drivers[0].name,
            manufacturer: entries[0].manufacturer,
          },
          {
            id: 2,
            carNumber: 2,
            carClass: 'P1',
            positionOverall: 2,
            positionInClass: 2,
            driverName: drivers[1].name,
            manufacturer: entries[1].manufacturer,
          },
        ]);
      }));
  });
});

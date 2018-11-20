/* eslint-disable no-console */

'use strict';

const faker = require('faker');

const CLASS_NAMES = ['P1', 'P2', 'GT1', 'GT2', 'TC1', 'TC2'];
const LAPS_PER_STINT = 40;

function generateRace(
  knex,
  options = { numEntries: 30, classes: CLASS_NAMES.slice(0, 3), numHours: 4 },
) {
  const newRace = {
    name: `${faker.company.companyName()} ${options.numHours} hours`,
    location: faker.address.city(),
  };

  let entries;
  let drivers;

  return knex('races')
    .insert(newRace)
    .returning('*')
    .then((race) => {
      entries = new Array(options.numEntries).fill().map((e, index) => ({
        race_id: race[0].id,
        car_number: index,
        class: options.classes[index % options.classes.length],
        manufacturer: faker.company.companyName(),
      }));
      return knex('entries')
        .insert(entries)
        .returning('*');
    })
    .then((theEntries) => {
      entries = theEntries;
      const generatedDrivers = entries.reduce((acc) => {
        for (let i = 0; i < 3; i += 1) {
          acc.push({
            name: faker.name.findName(),
          });
        }
        return acc;
      }, []);
      return knex('drivers')
        .insert(generatedDrivers)
        .returning('*');
    })
    .then((theDrivers) => {
      drivers = theDrivers;
      const driverEntries = entries.reduce((acc, entry, index) => {
        acc.push(
          ...drivers
            .slice(index, index + 3)
            .map(driver => ({ driver_id: driver.id, entry_id: entry.id })),
        );
        return acc;
      }, []);
      return knex('entries_drivers').insert(driverEntries);
    })
    .then(() => {
      const entryLaps = entries.map((entry, index) => {
        // This will mean that P1 laps GT1 within 5 laps
        const baseLapTime = 90 + options.classes.indexOf(entry.class) * 9;

        const totalLaps = Math.ceil((options.numHours * 3600) / baseLapTime);
        const laps = [];

        for (let lapNum = 0; lapNum < totalLaps; lapNum += 1) {
          const lap = {
            entry_id: entry.id,
            lap_number: lapNum,
            position_overall: index + 1,
            position_class: (index % options.classes.length) + 1,
            lap_time: Math.ceil(baseLapTime + baseLapTime * Math.random() * 0.11),
            driver_id:
              drivers[index * 3 + (Math.floor(lapNum / LAPS_PER_STINT) % 3)].id,
          };
          laps.push(lap);
        }

        return laps;
      });
      return Promise.all(entryLaps.map(laps => knex('laps').insert(laps)));
    });
}

function seed(knex) {
  return knex('races')
    .del()
    .then(() => generateRace(knex))
    .then(() => {
      const options = { numEntries: 60, classes: CLASS_NAMES.slice(2), numHours: 10 };
      return generateRace(knex, options);
    });
}

module.exports = { seed };

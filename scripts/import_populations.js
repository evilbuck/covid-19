const knex = require('../db');
const moment = require('moment');
const fs = require('fs');
const csv = require('csvtojson');
const nonDates = ['countyFIPS', 'County Name', 'State', 'stateFIPS'];
const _ = require('lodash');

function handleError(error) {
  console.error('found error', error);
}

module.exports = async function (fileName) {
  const stream = fs.createReadStream(fileName);
  // parse csv
  // Invoking csv returns a promise

  csv()
    .fromStream(stream)
    .subscribe(
      async (d) => {
        let data = {
          county: d['County Name'],
          state: d.State,
          population: d.population,
        };
        return knex('counties').insert(data);
      },
      handleError,
      (data) => {
        console.log('done', data);
      }
    );
};

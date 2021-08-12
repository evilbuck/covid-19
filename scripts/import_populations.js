const knex = require('../db');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const csv = require('csvtojson');
const nonDates = ['countyFIPS', 'County Name', 'State', 'stateFIPS'];
const _ = require('lodash');
const main = require('./import_cases');

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
        return Promise.all([
          knex('counties').insert(data),
          knex('covid_stats')
            .update({ population: data.population })
            .where({ county_fips: d.countyFIPS }),
        ]);
      },
      handleError,
      (data) => {
        console.log('done', data);
      }
    );
};

if (require.main === module) {
  let csvPath = path.resolve(`${__dirname}/../data/county_population.csv`);
  main(csvPath)
    .then((result) => {
      console.log('done', result);
    })
    .catch((error) => {
      console.error('error', error);
    });
}

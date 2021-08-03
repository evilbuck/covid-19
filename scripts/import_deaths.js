const knex = require('../db');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const csv = require('csvtojson');

const _ = require('lodash');
const nonDates = ['countyFIPS', 'County Name', 'State', 'StateFIPS'];

function handleError(error) {
  console.error('found error', error);
}

const main = async (fileName) => {
  console.log('preparing to truncate');
  await knex('covid_stats').truncate();
  const stream = fs.createReadStream(fileName);
  // parse csv
  // Invoking csv returns a promise

  await csv()
    .fromStream(stream)
    .subscribe(
      async (d) => {
        let county = _.pick(d, nonDates);
        let dates = _.omit(d, nonDates);

        let countyRecords = [];
        let prevTotal = 0;
        _(dates).each((count, dateString) => {
          count = parseInt(count, 10);
          // let parsed = moment(dateString, 'M/D/YY');
          let parsed = moment(dateString, 'YYYY-MM-DD');
          let record = {
            date: parsed.toDate(),
            county: county['County Name'],
            state: county.State,
            deaths: parseInt(count - prevTotal),
            county_fips: county.countyFIPS,
            state_fips: county.StateFIPS,
          };
          countyRecords.push(record);
          prevTotal = count;
        });

        console.log('done with county ' + county['County Name']);
        return await knex('covid_stats').insert(countyRecords);
      },
      handleError,
      (data) => {
        console.log('done', data);
      }
    );
};

module.exports = main;

if (require.main === module) {
  let deathsCsvPath = path.resolve(`${__dirname}/../data/deaths.csv`);
  console.log('loading', deathsCsvPath);
  main(deathsCsvPath)
    .then((result) => {
      console.log('finished with result', result);
      process.exit();
    })
    .catch((error) => {
      console.error(error);
      process.exit(error.code ?? 1);
    });
}

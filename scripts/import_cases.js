const knex = require('../db');
const moment = require('moment');
const fs = require('fs');
const csv = require('csvtojson');
const _ = require('lodash');
const path = require('path');

const nonDates = ['countyFIPS', 'County Name', 'State', 'stateFIPS', 'StateFIPS'];

function handleError(error) {
  console.error('found error', error);
}

async function main(fileName) {
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
        let updates = [];
        _(dates).each((count, dateString) => {
          let parsed = moment(dateString, 'YYYY-MM-DD');
          let record = {
            date: parsed.toDate(),
            cases: parseInt(count - prevTotal),
          };
          prevTotal = count;
          updates.push(
            knex('covid_stats')
              .where({
                date: parsed.toDate(),
                state: county.State,
                county: county['County Name'],
              })
              .update(record)
          );
        });

        await Promise.all(updates);

        console.log('done with county ' + county['County Name']);
      },
      handleError,
      (data) => {
        console.log('done', data);
      }
    );
}

module.exports = main;

if (require.main === module) {
  let caseCsvPath = path.resolve(`${__dirname}/../data/known.csv`);
  main(caseCsvPath)
    .then((result) => {
      console.log('finished with result', result);
      process.exit();
    })
    .catch((error) => {
      console.error(error);
      process.exit(error.code ?? 1);
    });
}

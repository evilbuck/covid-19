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
        let county = _.pick(d, nonDates);
        let dates = _.omit(d, nonDates);

        let countyRecords = [];
        // let confirmedCounts = [];
        let prevTotal = 0;
        let updates = [];
        _(dates).each((count, dateString) => {
          let parsed = moment(dateString, 'M/D/YY');
          let record = {
            // date: parsed.toDate(),
            // county: county['County Name'],
            // state: county.State,
            cases: parseInt(count - prevTotal),
            // county_fips: county.countyFIPS,
            // state_fips: county.stateFIPS,
          };
          // countyRecords.push(record);
          prevTotal = count;
          // prevTotal += count;
          updates.push(
            knex('us_county')
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
};

const knex = require('./db');
const moment = require('moment');

const csv = require('csvtojson');

const _ = require('lodash');
const nonDates = ['countyFIPS', 'County Name', 'State', 'stateFIPS'];

(async () => {
  // parse csv
  // Invoking csv returns a promise
  await knex('us_county').del();

  const converter = csv();
  let json = await converter.fromFile('./data/covid_confirmed_usafacts.csv');
  let data = json.reduce((memo, d) => {
    return memo.then(() => {
      let county = _.pick(d, nonDates);
      let dates = _.omit(d, nonDates);

      let confirmedCounts = [];
      _(dates).each((count, dateString) => {
        let parsed = moment(dateString, 'M/D/YY');
        let record = {
          date: parsed.toDate(),
          county: county['County Name'],
          state: county.State,
          cases: parseInt(count),
          county_fips: county.countyFIPS,
          state_fips: county.stateFIPS,
        };

        // console.log('record:', record);
        confirmedCounts.push(record);
      });

      // console.log('confirmed:', confirmedCounts);
      return knex('us_county').insert(confirmedCounts);
    });
  }, Promise.resolve());
})();
// write to db

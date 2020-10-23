const knex = require('./db');
const moment = require('moment');
const fs = require('fs');

const csv = require('csvtojson');

const _ = require('lodash');
const nonDates = ['countyFIPS', 'County Name', 'State', 'stateFIPS'];

function handleError(error) {
  console.error('found error', error);
}

module.exports = async (fileName, tableName) => {
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
        let prevTotal = 0;
        _(dates).each((count, dateString) => {
          let parsed = moment(dateString, 'M/D/YY');
          let record = {
            date: parsed.toDate(),
            county: county['County Name'],
            state: county.State,
            deaths: parseInt(count - prevTotal),
            county_fips: county.countyFIPS,
            state_fips: county.stateFIPS,
          };
          countyRecords.push(record);
          prevTotal = count;
        });

        console.log('done with county ' + county['County Name']);
        return await knex('us_county').insert(countyRecords);
      },
      handleError,
      (data) => {
        console.log('done', data);
      }
    );
};

// const converter = csv({ noheader: false });
// // let json = await converter.fromFile('./data/covid_confirmed_usafacts.csv');
// let json = await converter.fromFile(fileName);
// let data = json.reduce((memo, d) => {
//   let county = _.pick(d, nonDates);
//   let dates = _.omit(d, nonDates);

//   // let confirmedCounts = [];
//   _(dates).each((count, dateString) => {
//     let parsed = moment(dateString, 'M/D/YY');
//     let record = {
//       date: parsed.toDate(),
//       county: county['County Name'],
//       state: county.State,
//       deaths: parseInt(count),
//       county_fips: county.countyFIPS,
//       state_fips: county.stateFIPS,
//     };

//     // confirmedCounts.push(record);
//     memo.push(record);
//   });

//   // return confirmedCounts;
//   return memo;
// }, []);

// return data;
// };

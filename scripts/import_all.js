const knex = require('../db');
const etlDeaths = require('./import_deaths');
const path = require('path');
const importCases = require('./import_cases');
const importPopulations = require('./import_populations');

async function main() {
  console.log('etl deaths by county');
  await knex('covid_stats').del();
  await knex('counties').del();

  let deathsCsvPath = path.resolve(`${__dirname}/../data/deaths.csv`);
  console.log('importing deaths', deathsCsvPath);
  await etlDeaths(deathsCsvPath);

  // TODO: enable cases
  console.log('importing cases');
  await importCases(path.resolve(`${__dirname}/../data/known.csv`));

  console.log('importing population');
  await importPopulations(path.resolve(`${__dirname}/../data/county_population.csv`));

  // console.log('etl done');

  return 'etl done';
}

module.exports = main;

if (require.main === module) {
  main()
    .then((result) => {
      console.log('finished bulk data refresh');
    })
    .catch((error) => {
      console.error('fucking error', error);
    });
}

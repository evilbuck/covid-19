const knex = require('../db');
const etlCounty = require('../import_usa_facts');
const path = require('path');
const importCases = require('./import_cases');
const importPopulations = require('./import_populations');

async function main() {
  console.log('etl deaths by county');
  await knex('us_county').del();
  await knex('counties').del();
  console.log('importing deaths');
  await etlCounty(path.resolve(`${__dirname}/../data/deaths.csv`));
  console.log('importing cases');
  await importCases(path.resolve(`${__dirname}/../data/known.csv`));
  console.log('importing population');
  await importPopulations(path.resolve(`${__dirname}/../data/county_population.csv`));

  console.log('etl done');
}

module.exports = main;
// main();

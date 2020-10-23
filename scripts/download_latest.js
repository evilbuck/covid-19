const knownCasesUrl = `https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_confirmed_usafacts.csv`;
const deathsUrl = `https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_deaths_usafacts.csv`;
const countyPopulationUrl = `https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_county_population_usafacts.csv`;
const fs = require('fs');
const axios = require('axios');
const _ = require('lodash');
const etlCounty = require('../import_usa_facts');
const path = require('path');
const knex = require('../db');
const processCsvs = require('./import_deaths');

const dataUrls = {
  known: knownCasesUrl,
  deaths: deathsUrl,
  county_population: countyPopulationUrl,
};

async function main() {
  await Promise.all(
    // download
    _.map(dataUrls, async (url, key) => {
      let { data } = await axios.get(url);
      let fileName = `${__dirname}/../data/${key}.csv`;
      fs.writeFileSync(__dirname + `/../data/${key}.csv`, data);
    })
  );

  console.log('done downloading');
  await processCsvs();
  // process.exit(0);
  // console.log('etl deaths by county');
  // await knex('us_county').del();
  // await etlCounty(path.resolve(`${__dirname}/../data/deaths.csv`));
  // console.log('etl done');
  // let deathCounts = await etlCounty(path.resolve(`${__dirname}/../data/deaths.csv`));
  // console.log('deathcounts', deathCounts.length, '\n', deathCounts.slice(0, 5));
  // console.log('deleting us_county');
  // console.log('done deleting us_county');

  // console.log('inserting');
  // await knex('us_county').insert(deathCounts);
  // console.log('done with deaths by county');
}

main();

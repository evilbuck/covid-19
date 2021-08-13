const knownCasesUrl = `https://static.usafacts.org/public/data/covid-19/covid_confirmed_usafacts.csv`;
const deathsUrl = `https://static.usafacts.org/public/data/covid-19/covid_deaths_usafacts.csv`;
const countyPopulationUrl = `https://static.usafacts.org/public/data/covid-19/covid_county_population_usafacts.csv`;

const fs = require('fs');
const axios = require('axios');
const _ = require('lodash');

const dataUrls = {
  known: knownCasesUrl,
  deaths: deathsUrl,
  county_population: countyPopulationUrl,
  vaccinations: `https://data.cdc.gov/api/views/w9zu-fywh/rows.csv?accessType=DOWNLOAD`,
  vaccinations_by_jurisdiction: `https://data.cdc.gov/api/views/unsk-b7fc/rows.csv?accessType=DOWNLOAD`,
  vaccinations_by_county: `https://data.cdc.gov/api/views/8xkx-amqh/rows.csv?accessType=DOWNLOAD`,
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

  return 'done';
}

if (require.main === module) {
  main()
    .then((result) => {
      console.log(result);
      process.exit();
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// const { report } = require('../../app');
const knex = require('../../db');
const { joinRaw } = require('../../db');
const moment = require('moment');
const { groupBy } = require('lodash');

async function reportType(context) {
  let { data, params, service } = context;
  let { reportType, endDate, startDate, groupByCounty, groupByState } = params.query;

  let demographics = await knex('counties')
    .select('state')
    .sum('population as population')
    .groupBy('state');

  let demoDict = demographics.reduce((memo, item) => {
    if (!memo[item.state]) memo[item.state] = item;
    return memo;
  }, {});
  context.params.demographics = demoDict;

  let query = knex('us_county')
    .select('date')
    .sum('deaths as deaths')
    .sum('cases as cases')
    .orderBy('deaths');
  if (reportType === 'granular') {
    query.select('state').groupBy('state').groupBy('date');
    context.params.knex = query;
  }

  if (reportType === 'compare states') {
    if (endDate && startDate) {
      query.whereBetween('date', [
        moment(startDate).startOf('day').toISOString(),
        moment(endDate).endOf('day').toISOString(),
      ]);
    }

    if (groupByCounty) {
      query.select('us_county.county as x').groupBy('us_county.county');
    }
    if (groupByState) {
      query.select('state').groupBy('state');
    }
    console.log('query:', query.toString());
    context.params.knex = query;
  }

  if (reportType === 'percent-of-deaths-by-population') {
    let where = '';
    let start = moment(startDate).startOf('day').toISOString();
    let end = moment(endDate).endOf('day').toISOString();
    if (endDate && startDate) {
      where = ` where date between '${start}' and '${end}'`;
    }
    query = knex
      .select(['deaths', 'counts.state', 'population'])
      .from(
        knex.raw(
          `(select sum(deaths) as deaths, state from us_county ${where} group by state ) as counts `
        )
      )
      .joinRaw(
        `inner join (select sum(population) as population, counties.state 
          from counties group by state) census 
          on census.state = counts.state`
      );
    context.params.knex = query;
  }

  // console.log('query:', (await query).toString());
}

async function decorateReport(context) {
  let { result, params, service } = context;
  let { reportType } = params.query;

  if (reportType === 'granular') {
    context.result = {
      demographics: params.demographics,
      covid: result,
    };
    // let { demographics } = params;
    // demographics.reduce((memo, item) => {
    //   if (!memo[item.state]) {
    //     memo[item.state]
    //   }
    // }, {})
    console.log('result', result);
  }

  if (reportType === 'percent-of-deaths-by-population') {
    result = result.sort((a, b) => a.deaths / a.population - b.deaths / b.population);
    let data = {
      labels: result.map((v) => v.state),
      datasets: [
        {
          label: 'population death %',
          data: result.map((v) => ((v.deaths / v.population) * 100).toFixed(4)),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    context.result = data;
  }

  if (reportType === 'compare states') {
    let data = {
      labels: result.map((v) => v.x),
      datasets: [
        {
          label: '# deaths',
          data: result.map((v) => v.deaths),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    context.result = data;
  }
}

module.exports = {
  before: {
    find: [reportType],
  },
  after: {
    find: [decorateReport],
  },
};

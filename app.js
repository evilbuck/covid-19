const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const app = express(feathers());
const knex = require('./db');
const { Model } = require('objection');
Model.knex(knex);
const cors = require('cors');

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Host static files from the current folder
app.use(express.static(__dirname + '/public'));
// Add REST API support
app.configure(express.rest());
app.use(cors());
app.use(express.errorHandler());
app.use(express.urlencoded({ extended: true }));

// const { Service } = require('feathers-knex');

// class Covid extends Service {
//   async create(data, params) {
//     console.log('create: ', data);
//     return super.create(data, params);
//   }
// }

const services = require('./services/index');
app.configure(services);

// app.use(
//   '/covid',
//   new Covid({
//     Model: knex,
//     name: 'us_county',
//   })
// );
// app.service('/covid').hooks({
//   before: {
//     patch: [
//       async (context) => {
//         console.log('patching with', context.params, '\n', context.data);
//         // super.create()
//       },
//     ],
//   },
// });

module.exports = app;

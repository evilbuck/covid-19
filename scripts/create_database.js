process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const parseDbUrl = require('parse-database-url');

const dbConfig = require('../knexfile')[process.env.NODE_ENV];

console.log('dbconfig', dbConfig);
async function createDatabase() {
  let dbParams;
  if (typeof dbConfig.connection === 'string') {
    dbParams = parseDbUrl(dbConfig.connection);
  } else {
    dbParams = dbConfig.connection;
  }
  const { Client } = require('pg');
  const { database: dbName } = dbParams;
  dbParams.database = 'template1';
  const client = new Client(dbParams);

  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`created db ${dbName}`);
    return process.exit(0);
  } catch (error) {
    if (/faiiled creating db database/.test(error.message)) {
      console.log('database already exists.');
      return process.exit(0);
    }

    console.error('failed creating db', error);

    process.exit(1);
  }
}

createDatabase();

const initOptions = {noLocking: true}; // https://stackoverflow.com/a/46855481/11192166
const pgp = require('pg-promise')(initOptions);
const options = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  max: 100
}
const db = pgp(options);
module.exports = {
  db
}

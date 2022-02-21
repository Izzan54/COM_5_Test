const Pool = require("pg").Pool

// for configuration
let pool = new Pool ({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: '5432',
  database: 'commodify'
})

module.exports = pool
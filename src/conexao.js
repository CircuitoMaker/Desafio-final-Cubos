require('dotenv').config();
const {Pool} = require('pg')

const pool = new Pool({
    host:'localhost',
    port:5432,
    user:'postgres',
    password:'123456',
    database:'pdv'
    
    
    
    // host: process.env.BD_HOST,
    // port: process.env.BD_PORT,
    // user: process.env.BD_USER,
    // password: process.env.BD_PASS,
    // database: process.env.BD_NAME

})

module.exports = pool
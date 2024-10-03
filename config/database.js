const mysql = require('mysql')
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('./config/dbcfg.json', 'utf8'));

const config_mysql = {
    user: cfg.mysql.user,
    password: cfg.mysql.password,
    host: cfg.mysql.server,
    port: cfg.mysql.port,
    database: cfg.mysql.database,
    dateStrings: true
}

exports.queryMySQL = (query, params) => {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection(config_mysql)
        //console.log(query)
        connection.query(query, params, (err, rows, fields) => {
            if (err) reject(err)
            else resolve(rows)
            connection.end()
        })
    })
}

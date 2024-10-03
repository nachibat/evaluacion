const queryMySQL = require("../../config/database").queryMySQL;

exports.getAll = () => {
    return queryMySQL(`select * from provincias`, []);
}
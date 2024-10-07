const queryMySQL = require('../../config/database').queryMySQL;

exports.getMediosPago = () => {
    return queryMySQL('SELECT * FROM medios_pago', []);
}
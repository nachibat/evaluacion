const queryMySQL = require("../../config/database").queryMySQL;

exports.addEvento = (usuario, evento, observacion, tabla) => {
    params = [usuario, evento, observacion, tabla]
    return queryMySQL(`
		INSERT INTO eventos (fecha_hora, idusuario, evento, observ, tabla) 
		values (NOW(), ?, ?, ?, ?);
	`, params);
}
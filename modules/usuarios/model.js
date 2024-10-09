const queryMySQL = require("../../config/database").queryMySQL;

exports.getAll = () => {
	return queryMySQL("SELECT * FROM secr ORDER BY usuario", []);
}

exports.getByName = username => {
	params = [username];
	return queryMySQL(`
		SELECT * FROM secr 
		WHERE usuario = ?`, params);
}

exports.getByEmail = email => {
	params = [email];
	return queryMySQL(`SELECT * FROM clientes WHERE mail = ? AND activo = 1`, params);
}

exports.insert = (usuario, mail, clave, niveles) => {
	params = [usuario, mail, clave, niveles];
	return queryMySQL(`INSERT INTO secr (usuario, mail, clave, activa, alta, niveles) 
		VALUES (?, ?, ?, 1, NOW(), ?);`, params);
}

exports.borrarSecr2 = unica => {
	params = [unica];
	return queryMySQL("DELETE FROM secr2 WHERE unica = ?", params);
}

exports.borrar = unica => {
	params = [unica];
	return queryMySQL("DELETE FROM secr WHERE unica = ?", params);
}

exports.getById = (unica, cliente) => {
	const tabla = cliente ? 'clientes' : 'secr';
	const field = cliente ? 'id' : 'unica';
	params = [unica];
	return queryMySQL(`select * from ${tabla} where ${field} = ?`, params);
}

exports.update = (id, usuario, mail, niveles, activo) => {
	params = [usuario, mail, activo, niveles, id];
	return queryMySQL(`
		UPDATE secr SET usuario= ?, mail= ?, activa = ?, niveles= ?
		WHERE unica= ?`, params);
}

exports.updatePass = (unica, pass, cliente) => {
	const tabla = cliente ? 'clientes' : 'secr';
	const field = cliente ? 'id' : 'unica';
	const fieldPass = cliente ? 'clave_web' : 'clave';
	params = [pass, unica];
	return queryMySQL(`UPDATE ${tabla} SET ${fieldPass} = ? WHERE ${field}= ?`, params);
}
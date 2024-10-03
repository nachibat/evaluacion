const queryMySQL = require("../../config/database").queryMySQL;

exports.getAccesosPorUsuario = unica => {
    params = [unica];
    return queryMySQL("SELECT * FROM secr2 WHERE unica = ? ORDER BY menu", params);
}

exports.VerificarNivelAdministracion = idUsuario => {
    params = [idUsuario];
    return queryMySQL("select niveles as tiene_permiso from secr where unica = ? and niveles = 'Administrador' ", params);
}

exports.verificarAcceso = (idUsuario, idMenu, permiso) => {
    params = [idUsuario, idMenu];
    return queryMySQL("select " + permiso + " from secr2 where unica = ? AND menu = ?", params);
}

exports.verificarAccesosAll = (idUsuario, idMenu) => {
    params = [idUsuario, idMenu];
    return queryMySQL("select * from secr2 where unica = ? AND menu = ?", params);
}

exports.getAyuda = idMenu => {
    params = [idMenu];
    return queryMySQL("select * from ayuda where id = ?", params);
}

exports.getMenues = () => {
    return queryMySQL("select * from ayuda", []);
}

exports.getLastMenuId = () => {
    return queryMySQL("select max(id) as id from ayuda", []);
}

exports.getLastAccesoId = unica => {
    params = [unica];
    return queryMySQL("select max(menu) as menu from secr2 where unica = ?", params);
}

exports.verificarmenu = (unica, menu) => {
    params = [unica, menu];
    return queryMySQL("select * from secr2 where unica = ? AND menu = ?", params);
}

exports.insertMenu = (unica, menu) => {
    params = [unica, menu];
    return queryMySQL("insert into secr2(unica, menu, a, b, c, m) values (?, ?, 0, 0, 0, 0);", params);
}

exports.updateAcceso = (unica, menu, acceso_short, value) => {
    params = [value, unica, menu];
    return queryMySQL(`
		UPDATE secr2 SET ${acceso_short} = ? WHERE unica = ? AND menu = ?
	`, params);
}

exports.selectMenu = name => {
    params = [name];
    return queryMySQL("SELECT id FROM ayuda WHERE route = ?", params);
}

exports.selectAction = name => {
    params = [name];
    return queryMySQL("SELECT short FROM accesos WHERE descripcion = ?", params);
}
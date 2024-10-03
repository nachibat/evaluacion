const queryMySQL = require("../../config/database").queryMySQL;

exports.getByIdProvincia = (idProvincia) => {
    return queryMySQL(`
    	select id, nombre, cp from localidades
    	where id_provincia_fk = ?
    	order by nombre`, [idProvincia]);
}
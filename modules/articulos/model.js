const queryMySQL = require('../../config/database').queryMySQL;

exports.getAll = () => {
    return queryMySQL(`SELECT articulos.id,
       articulos.descripcion as descripcion,
	   articulos.precio,
       rubros.descripcion as rubro,
       articulos.iva,
       articulos.activo
FROM  articulos 
INNER JOIN rubros 
ON articulos.id_rubro = rubros.id
WHERE articulos.activo = 1;`, []);
}

exports.getById = (id) => {
    params = [id];
    return queryMySQL(`SELECT * FROM articulos WHERE id = ?`, params);
}

exports.getRubros = () => {
    return queryMySQL(`SELECT * FROM rubros`, []);
}

exports.insert = (descripcion, precio, rubro, iva) => {
    params = [descripcion, precio, rubro, iva];
    return queryMySQL(`INSERT INTO articulos (descripcion, precio, id_rubro, iva, activo) 
        VALUES (?, ?, ?, ?, 1)`, params);
}

exports.update = (id, descripcion, precio, rubro, iva) => {
    params = [descripcion, precio, iva, rubro, id];
    return queryMySQL(`UPDATE articulos SET descripcion = ?, precio = ?, id_rubro = ?, iva = ?
        WHERE id = ?`, params);
}

exports.borrar = (id) => {
    params = [id];
    return queryMySQL('UPDATE articulos SET activo = 0 WHERE id = ?', params);
}
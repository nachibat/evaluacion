const queryMySQL = require('../../config/database').queryMySQL;

exports.getAll = () => {
    return queryMySQL(`SELECT articulos.descripcion as descripcion,
	   articulos.precio,
       rubros.descripcion as rubro,
       articulos.iva,
       articulos.activo
FROM  articulos 
INNER JOIN rubros 
ON articulos.id_rubro = rubros.id;`, []);
}

exports.getRubros = () => {
    return queryMySQL(`SELECT * FROM rubros`, []);
}
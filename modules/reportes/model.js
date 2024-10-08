const queryMySQL = require('../../config/database').queryMySQL;

exports.getMasVendidos = () => {
    return queryMySQL(`SELECT a.id, 
                            a.img, 
                            a.descripcion, 
                            a.precio, 
                            a.iva, 
                            COUNT(pd.articulo) AS veces_vendido
                        FROM pedidos_detalles pd
                        JOIN articulos a ON pd.articulo = a.id
                        GROUP BY a.id, a.descripcion, a.precio
                        ORDER BY veces_vendido DESC
                        LIMIT 10;`, []);
}

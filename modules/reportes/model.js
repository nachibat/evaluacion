const queryMySQL = require('../../config/database').queryMySQL;

exports.getMasVendidos = () => {
    return queryMySQL(`SELECT articulos.id, 
                        articulos.img, 
                        articulos.descripcion as articulo, 
                        articulos.precio, 
                        articulos.iva,
                        rubros.descripcion as rubro, 
                        COUNT(pedidos_detalles.articulo) AS veces_vendido
                    FROM pedidos_detalles, articulos, rubros
                    WHERE pedidos_detalles.articulo = articulos.id
                    AND articulos.id_rubro = rubros.id
                    GROUP BY articulos.id, articulos.img, articulos.descripcion, articulos.precio, articulos.iva, rubros.descripcion
                    ORDER BY veces_vendido DESC
                    LIMIT 10;`, []);
}

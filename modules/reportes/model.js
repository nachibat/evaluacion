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

exports.getListaMediosPago = (idMedioPago) => {
    const params = [idMedioPago];
    return queryMySQL(`SELECT pedidos_titulos.id,
                            pedidos_titulos.fecha_creado,
                            clientes.nombre,
                            clientes.apellido,
                            medios_pago.descripcion as medio_pago,
                            pedidos_titulos.subtotal
                    FROM pedidos_titulos
                    INNER JOIN clientes
                    ON clientes.id = pedidos_titulos.id_cliente
                    INNER JOIN medios_pago
                    ON medios_pago.id = pedidos_titulos.id_medio_pago
                    WHERE pedidos_titulos.id_medio_pago = ?;`, params);
}

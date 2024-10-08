const queryMySQL = require('../../config/database').queryMySQL;

exports.getMediosPago = () => {
    return queryMySQL('SELECT * FROM medios_pago', []);
}

exports.insertPedido = (idCliente, medioPago, subtotal) => {
    const params = [idCliente, medioPago, subtotal];
    return queryMySQL(`INSERT INTO pedidos_titulos (id_cliente, id_medio_pago, subtotal, fecha_creado)
        VALUES (?, ?, ?, NOW())`, params);
}

exports.insertDetallePedido = (idPedido, cantidad, articulo, precioUnitario) => {
    const params = [idPedido, cantidad, articulo, precioUnitario];
    return queryMySQL(`INSERT INTO pedidos_detalles (id_pedido_titulo, cantidad, articulo, precio_unitario)
        VALUES (?, ?, ?, ?)`, params);
}

exports.getPedidosList = (clientId) => {
    const params = [clientId];
    return queryMySQL(`
            SELECT pedidos_titulos.id,
                pedidos_titulos.fecha_creado,
                medios_pago.descripcion as medio_pago,
                pedidos_titulos.subtotal
            FROM pedidos_titulos
            INNER JOIN medios_pago
            ON pedidos_titulos.id_medio_pago = medios_pago.id
            WHERE id_cliente = ?
        `, params);
}

exports.getPedidoDetalle = (idPedido) => {
    const params = [idPedido];
    return queryMySQL(`
            SELECT pedidos_detalles.cantidad,
                articulos.descripcion,
                articulos.img,
                pedidos_detalles.precio_unitario
            FROM pedidos_detalles
            INNER JOIN articulos
            ON pedidos_detalles.articulo = articulos.id
            WHERE id_pedido_titulo = ?
        `, params);
}
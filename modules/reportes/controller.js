const cAccesos = require('../accesos/controller');
const mReportes = require('./model');

exports.getLista = async (req, res) => {
    const { id, nivel, id_menu } = req.session.user;
    const permisions = await cAccesos.getPermisosByMenu(id, nivel, id_menu);
    res.render('reportes/views/lista', {
        pagename: 'Reportes',
        permisions
    });
}

exports.getMasVendidos = async (req, res) => {
    const articulos = await mReportes.getMasVendidos();
    res.json(articulos);
}

exports.getListaMediosPago = async (req, res) => {
    const { idMedioPago } = req.params;
    const pedidos = await mReportes.getListaMediosPago(idMedioPago);
    res.json(pedidos);
}
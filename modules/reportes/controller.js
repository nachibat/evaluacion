const pdf = require('pdf-creator-node');
const fs = require('fs');

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
    let { from, to } = req.query;
    from += ' 00:00:00';
    to += ' 23:59:59';
    const pedidos = await mReportes.getListaMediosPago(idMedioPago, from, to);
    res.json(pedidos);
}

exports.generarPDF = async (req, res) => {
    const { items, template, total } = req.body;
    const title = template === 'articulos' ? 'Lista 10 de Artículos más vendidos' : 'Ingresos por ventas según medios de pago';
    var html = fs.readFileSync(__dirname + `/views/template_${template}.html`, 'utf8');
    var options = {
        format: 'A4',
        orientation: 'portrait',
        border: '10mm'
    };
    const data = { title, items, total };
    var document = {
        html: html,
        data,
        type: 'buffer'
    };
    pdf.create(document, options).then((pdfBuffer) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="reporte.pdf"');        
        res.send(pdfBuffer);
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ type: 'error', error });
    });
}
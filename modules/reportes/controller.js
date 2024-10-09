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

exports.generarPDFarticulos = async (req, res) => {
    const { masVendidos } = req.body;
    console.log(masVendidos);
    var html = fs.readFileSync(__dirname + "/views/template_articulos.html", "utf8");
    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm"
    };
    var document = {
        html: html,
        data: {
            articulos: masVendidos,
        },
        type: 'buffer'
    };
    pdf.create(document, options).then((pdfBuffer) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="articulos.pdf"');        
        res.send(pdfBuffer);
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ type: 'error', error });
    });
}
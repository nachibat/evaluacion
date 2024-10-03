const mArticulos = require('./model');
const cAccesos = require('../accesos/controller');

exports.getLista = async (req, res) => {
    const articulos = await mArticulos.getAll();
    res.render('articulos/views/lista', {
        pagename: 'Lista de artículos',
        articulos
    });
}

exports.getAlta = async (req, res) => {
    const rubros = await mArticulos.getRubros();
    console.log(rubros);
    res.render('articulos/views/alta', {
        pagename: 'Alta de artículos',
        rubros
    });
}
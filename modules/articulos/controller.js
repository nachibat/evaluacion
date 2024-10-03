const mArticulos = require('./model');
const mEventos = require('../eventos/model');
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
    res.render('articulos/views/alta', {
        pagename: 'Alta de artículos',
        rubros
    });
}

exports.postAlta = async (req, res) => {
    const { id } = req.session.user;
    const { descripcion, precio, iva, rubro } = req.body;
    if (!descripcion.length || !precio.length || !iva.length || !rubro.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });
    if (!isNumber(precio) || !isNumber(iva) || !isNumber(rubro)) return res.json({ type: "error", title: "Error", text: "Campos numéricos inválidos!" });
    const insert = await mArticulos.insert(descripcion, precio, rubro, iva);
    if (!insert.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    await mEventos.addEvento(id, 'Alta', `Alta id ${insert.insertId}, articulo: ${descripcion}`, 'articulos');
    res.json({ type: "success", title: "Exito", text: "Artículo dado de alta correctamente" });
}

exports.getModificar = async (req, res) => {
    const { id } = req.params;
    const articulo = await mArticulos.getById(id);
    const rubros = await mArticulos.getRubros();
    res.render('articulos/views/modificar', {
        pagename: 'Modificar artículo',
        rubros,
        articulo: articulo[0]
    });
}

exports.postModificar = async (req, res) => {
    const { id } = req.session.user;
    const { idArticulo, descripcion, precio, iva, rubro } = req.body;
    if (!descripcion.length || !precio.length || !iva.length || !rubro.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });
    if (!isNumber(precio) || !isNumber(iva) || !isNumber(rubro)) return res.json({ type: "error", title: "Error", text: "Campos numéricos inválidos!" });
    const update = await mArticulos.update(idArticulo, descripcion, precio, iva, rubro);
    if (!update.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    await mEventos.addEvento(id, 'Modificar', `Mod id ${idArticulo}, articulo: ${descripcion}`, 'articulos');
    res.json({ type: "success", title: "Exito", text: "Artículo modificado correctamente" });
}

exports.borrar = async (req, res) => {
    const { idArt } = req.body;
    const { id } = req.session.user;
    const deleted = await mArticulos.borrar(idArt);
    if (!deleted.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    await mEventos.addEvento(id, 'Borro', `Mod id ${idArt}`, 'articulos');
    res.json({ type: "success", title: "Exito", text: "Artículo eliminado correctamente" });
}

const isNumber = (d) => d == Number(d);
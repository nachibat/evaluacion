const mArticulos = require('./model');
const mEventos = require('../eventos/model');
const cAccesos = require('../accesos/controller');

exports.getArticulo = async (req, res) => {
    const { idArt } = req.params;
    const articulo = await mArticulos.getArticulo(idArt);
    res.json({ type: 'success', articulo });
}

exports.getLista = async (req, res) => {
    const articulos = await mArticulos.getAll();
    const rubros = await mArticulos.getRubros();
    const { id, nivel, id_menu } = req.session.user;
    const permisions = await cAccesos.getPermisosByMenu(id, nivel, id_menu);
    res.render('articulos/views/lista', {
        pagename: 'Lista de artículos',
        articulos,
        permisions,
        rubros
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
    const { descripcion, precio, iva, rubro, img } = req.body;
    if (!descripcion.length || !precio.length || !iva.length || !rubro.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });
    if (!isNumber(precio) || !isNumber(iva) || !isNumber(rubro)) return res.json({ type: "error", title: "Error", text: "Campos numéricos inválidos!" });
    const insert = await mArticulos.insert(descripcion, precio, rubro, iva, img);
    if (!insert.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    await mEventos.addEvento(id, 'Alta', `Alta id ${insert.insertId}, articulo: ${descripcion}`, 'articulos');
    res.json({ type: "success", title: "Exito", text: "Artículo dado de alta correctamente" });
}

exports.getArticulos = async (req, res) => {
    const articulos = await mArticulos.getAll();
    res.json(articulos);
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
    const { idArticulo, descripcion, precio, iva, rubro, img } = req.body;
    if (!descripcion.length || !precio.length || !iva.length || !rubro.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });
    if (!isNumber(precio) || !isNumber(iva) || !isNumber(rubro)) return res.json({ type: "error", title: "Error", text: "Campos numéricos inválidos!" });
    const update = await mArticulos.update(idArticulo, descripcion, precio, iva, rubro, img);
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

exports.postPreciosMasivos = async (req, res) => {
    const { id } = req.session.user;
    const { porcentaje, rubro, accion } = req.body;
    if (!porcentaje.length  || !rubro.length || !accion.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });
    if (!isNumber(porcentaje) || !isNumber(rubro)) return res.json({ type: "error", title: "Error", text: "Campos numéricos inválidos!" });
    const result = await mArticulos.preciosMasivos(porcentaje, rubro, accion);
    if (!result.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    await mEventos.addEvento(id, 'Modificar precios', `Mod rubro id ${rubro}`, 'articulos');
    res.json({ type: "success", title: "Exito", text: "Se modificaron los precios correctamente" });
}

const isNumber = (d) => d == Number(d);
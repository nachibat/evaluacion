const mUsuarios = require('./model');
const cAccesos = require('../accesos/controller');
const mEventos = require('../eventos/model');
const bcrypt = require('bcryptjs');

exports.getLista = async (req, res) => {
    const usuarios = await mUsuarios.getAll();
    const { id, nivel, id_menu } = req.session.user;
    const permisions = await cAccesos.getPermisosByMenu(id, nivel, id_menu)

    res.render("usuarios/views/lista", {
        pagename: 'Lista de Usuarios',
        permisions,
        usuarios,
        unica: id
    });
}

exports.getAlta = async (req, res) => {
    const nivel = req.session.user.nivel;
    res.render("usuarios/views/alta", {
        pagename: 'Alta de usuario',
        nivel
    });
}

exports.postAlta = async (req, res) => {
    const { usuario, mail, clave, niveles } = req.body;
    const { id } = req.session.user;

    // Validaciones
    if (!usuario.length || !mail.length || !clave.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });

    // Usuario Existe
    const userExist = await mUsuarios.getByName(usuario);
    if (userExist.length) return res.json({ type: "error", title: "Error", text: "El nombre de usuario ya existe" });

    //valid mail
    if (!mail.length || !validateEmail(mail)) return res.json({ type: "error", title: "Error", text: "Ingrese un mail valido" });
    
    //longitud de pass
    if(clave.length < 6) return res.json({ type: "error", title: "Error", text: "La clave debe contener al menos 6 caracteres!" });

    // Hash Password
    bcrypt.genSalt(10, (err, salt) => { //GENERO EL SALT PARA LA PASS
        bcrypt.hash(clave, salt, async (err, hash) => { //HASHEO LA PASS
            let insert = await mUsuarios.insert(usuario, mail, hash, niveles);
            if (!insert.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
            await mEventos.addEvento(id, "Alta", `Alta id: ${insert.insertId}, usuario: ${usuario}, mail: ${mail}`, "secr");
            res.json({ type: "success", title: "Exito", text: "Usuario dado de alta correctamente" });
        });
    });
}

exports.getModificar = async (req, res) => {
    const { unica } = req.params;
    const usuario = await mUsuarios.getById(unica);
    res.render('usuarios/views/modificar', {
        pagename: 'Modificar usuario',
        usuario: usuario[0]
    });
}

exports.postModificar = async (req, res) => {
    const { unica, usuario, mail, niveles, activa } = req.body;
    const { id } = req.session.user;
    // Validaciones
    if (!usuario.length || !mail.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });
    // Usuario Existe
    const userExist = await mUsuarios.getByName(usuario);
    if (userExist.length && userExist[0].unica != unica) return res.json({ type: "error", title: "Error", text: "El nombre de usuario ya existe" });

    if (!mail.length || !validateEmail(mail)) return res.json({ type: "error", title: "Error", text: "Ingrese un mail valido" });
    const update = await mUsuarios.update(unica, usuario, mail, niveles, activa);
    if (!update.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
    await mEventos.addEvento(id, "Modificar", `Mod unica: ${unica}, usuario: ${usuario}, mail: ${mail},  activa: ${activa}`, "secr");
    res.json({ type: "success", title: "Exito", text: "Usuario Modificado" });
}

exports.borrar = async (req, res) => {
    const { unica } = req.body;
    const { id } = req.session.user;

    await mUsuarios.borrarSecr2(unica);
    const resultado = await mUsuarios.borrar(unica);
    if (!resultado.affectedRows) return res.json({ type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' });
    await mEventos.addEvento(id, "Borro", `Borro unica: ${unica}`, "secr");
    res.json({ type: 'success', title: 'Exito', text: 'Usuario borrado correctamente' });
}

exports.getPass = (req, res) => {
    res.render('usuarios/views/changePass', {
        pagename: 'Cambiar contraseña'
    });
}

exports.postPass = async (req, res) => {
    const { actual, nueva, nuevaConfirm } = req.body;
    const { id } = req.session.user;

    // Validaciones
    if (!actual.length || !nueva.length || !nuevaConfirm.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos" });
    if (nueva !== nuevaConfirm) return res.json({ type: "error", title: "Error", text: "Las claves deben coincidir" });
    if (nueva.length < 6) return res.json({ type: "error", title: "Error", text: "La clave debe tener al menos 6 caracteres" });
    const user = await mUsuarios.getById(id);
    let ismatch = await comparePassword(actual, user[0].clave);
    if (!ismatch) return res.json({ type: "error", title: "Error", text: "Clave actual incorrecta. Intente nuevamente" });

    bcrypt.genSalt(10, (err, salt) => { //GENERO EL SALT PARA LA PASS
        bcrypt.hash(nueva, salt, async (err, hash) => { //HASHEO LA PASS
            const update = await mUsuarios.updatePass(user[0].unica, hash);
            if (!update.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
            await mEventos.addEvento(id, "Cambio Pass", `Cambio Pass unica: ${user[0].unica}, usuario: ${user[0].usuario}`, "secr");
            res.json({ type: "success", title: "Exito", text: "Contraseña modificada correctamente" });
        });
    });
}

exports.restartPass = async (req, res) => {
    const { unica, pass } = req.body;
    const { id } = req.session.user;
    //const pass = '123456'; //valor por defecto..

    //longitud de pass
    if(pass.length < 6) return res.json({ type: "error", title: "Error", html: "La clave debe contener al menos 6 caracteres!" });

    const user = await mUsuarios.getById(unica);

    bcrypt.genSalt(10, (err, salt) => { //GENERO EL SALT PARA LA PASS
        bcrypt.hash(pass, salt, async (err, hash) => { //HASHEO LA PASS
            await mUsuarios.updatePass(user[0].unica, hash);
            await mEventos.addEvento(id, "Reset Pass", `Reset Pass unica: ${user[0].unica}, usuario: ${user[0].usuario}, mail: ${user[0].mail}`, "secr");
            res.send({ type: 'success', title: 'Exito', html: 'Reseteado Exitosamente. La clave es <b>\"'+pass+'\".</b>' });
        });
    });
}

function comparePassword(candidatePassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
            if (err) reject(err);
            resolve(isMatch);
        });
    });
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
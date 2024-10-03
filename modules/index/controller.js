const mUsuarios = require('../usuarios/model')
const mEventos = require('../eventos/model')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const constants = JSON.parse(fs.readFileSync('./config/constants.json', 'utf8'))

exports.getInicio = async (req, res) => {
  res.render('index/views/inicio', {
    gmaps_api_key: constants.gmaps_api_key
  })
}

exports.getHome = async (req, res) => {
  res.render('index/views/home'), {}
}

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username.length || !password.length) return res.json({ type: "error", title: "Error", text: 'Complete los campos' });
    
    const usuario = await mUsuarios.getByName(username);
    if (!usuario.length) return res.json({ type: 'error', title: 'Error', text: 'El Usuario o la contraseña no coinciden' });
    const result = await comparePassword(password, usuario[0].clave);
    if (!result) return res.json({ type: "error", title: "Error", text: 'El Usuario o la contraseña no coinciden' });
    if (usuario[0].activa == 0) return res.json({ type: "error", title: "Error", text: 'El Usuario no está activo' });

    req.session.user = {
        id: usuario[0].unica,
        nombre: usuario[0].usuario,
        mail: usuario[0].mail,
        nivel: usuario[0].niveles,
    }
    req.session.auth = true;
    req.session.save();
    await mEventos.addEvento(usuario[0].unica, "Login", `login: ${usuario[0].usuario}`, "secr");
    return res.json("ok");
}

function comparePassword(candidatePassword, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}
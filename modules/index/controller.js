const mUsuarios = require('../usuarios/model')
const mEventos = require('../eventos/model')
const mIndex = require('./model');
const bcrypt = require('bcryptjs')
const fs = require('fs')
const constants = JSON.parse(fs.readFileSync('./config/constants.json', 'utf8'))
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.getInicio = async (req, res) => {
  res.render('index/views/inicio', {
    gmaps_api_key: constants.gmaps_api_key
  })
}

exports.getHome = async (req, res) => {
  res.render('index/views/home'), {}
}

exports.getCarrito = async (req, res) => {
  res.render('index/views/carrito'), {}
}

exports.getPedidos = async (req, res) => {
  res.render('index/views/pedidos'), {}
}

exports.getSession = async (req, res) => {
  if (req.session.user) {
    res.json({ sesionIniciada: true, user: req.session.user });
  } else {
    res.json({ sesionIniciada: false });
  }
}

exports.getSessionCarrito = async (req, res) => {
  const { idArt } = req.params;
  if (!req.session?.user) return res.json({ sesionIniciada: false });
  if (req.session?.user?.carrito?.length) {
    const idx = req.session.user.carrito.findIndex(item => item.idArt === idArt);
    if (idx > -1) req.session.user.carrito[idx].cantidad += 1;
    else req.session.user.carrito.push({ idArt, cantidad: 1 });
  } else {
    req.session.user.carrito = [{ idArt, cantidad: 1 }];
  }
  res.json({ sesionIniciada: true, user: req.session.user });
}

exports.setSessionCarrito = (req, res) => {
  const { carrito } = req.body;
  req.session.user.carrito = carrito;
  res.json({ sesionIniciada: true, user: req.session.user });
}

exports.getMediosPago = async (req, res) => {
  const medios = await mIndex.getMediosPago();
  res.json(medios);
}

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username.length || !password.length) return res.json({ type: "error", title: "Error", text: 'Complete los campos' });
    
    const usuario = await mUsuarios.getByName(username);
    if (usuario.length) {
      login(req, res, usuario[0], password);
    } else {
      const web_usuario = await mUsuarios.getByEmail(username);
      if (!web_usuario.length) return res.json({ type: 'error', title: 'Error', text: 'El Usuario o la contraseña no coinciden' });
      login(req, res, web_usuario[0], password, true);
    }
}

function comparePassword(candidatePassword, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

async function login(req, res, user, password, webUser = false) {
  const result = await comparePassword(password, webUser ? user.clave_web : user.clave);
  if (!result) return res.json({ type: "error", title: "Error", text: 'El Usuario o la contraseña no coinciden' });
  if (!webUser && user.activa == 0) return res.json({ type: "error", title: "Error", text: 'El Usuario no está activo' });
  let userData = {};
  if (webUser) {
    userData = {
      id: user.id,
      nombre: user.nombre,
      mail: user.mail,
      webUser: true
    };
  } else {
    userData = {
      id: user.unica,
      nombre: user.usuario,
      mail: user.mail,
      nivel: user.niveles,
    };
  }
  req.session.user = userData;
  req.session.auth = true;
  req.session.save();
  await mEventos.addEvento(webUser ? user.id : user.unica, "Login", `login: ${webUser ? user.mail : user.usuario}`, webUser ? "clientes" : "secr");
  return res.json({ type: 'success', user: user });
}

exports.guardarPedido = async (req, res) => {
  const data = req.body.data;
  const pedido = await mIndex.insertPedido(data.userId, data.medioPago, data.total);
  const pedidoID = pedido.insertId;
  for (const item of data.carrito) {
    const precioUnitario = Number(item.precio) + Number(item.precio) * Number(item.iva) / 100;
    await mIndex.insertDetallePedido(pedidoID, item.cantidad, item.id, precioUnitario);
  }
  req.session.user.carrito = [];
  return res.json({ type: 'success', id: pedido.insertId });
}

exports.getPedidosList = async (req, res) => {
  const pedidos = await mIndex.getPedidosList(req.session.user.id);
  res.json(pedidos);
}

exports.getPedidoDetalle = async (req, res) => {
  const { idPedido } = req.params;
  const articulos = await mIndex.getPedidoDetalle(idPedido);
  res.json(articulos);
}

exports.guardarCliente = async (req, res) => {
  const token = crypto.randomBytes(20).toString('hex');
  const { nombre, apellido, email, tel, pass } = req.body;
  if (!nombre.length || !apellido.length || !email.length || !tel.length || !pass.length) return res.json({ type: "error", title: "Error", text: "Complete todos los campos!" });
  const userExist = await mIndex.getUsuarioByMail(email);
  if (userExist.length) return res.json({ type: "error", title: "Error", text: "El email está en uso" });
  const clientExist = await mIndex.getClienteByMail(email);
  if (clientExist.length) return res.json({ type: "error", title: "Error", text: "El email está en uso" });
  if (!email.length || !validateEmail(email)) return res.json({ type: "error", title: "Error", text: "Ingrese un mail valido" });
  if (pass.length < 6) return res.json({ type: "error", title: "Error", text: "La clave debe contener al menos 6 caracteres!" });
  bcrypt.genSalt(10, (err, salt) => { //GENERO EL SALT PARA LA PASS
    bcrypt.hash(pass, salt, async (err, hash) => { //HASHEO LA PASS
        let insert = await mIndex.insertCliente(nombre, apellido, email, tel, hash, token);
        if (!insert.affectedRows) return res.json({ type: "error", title: "Error", text: "Hubo un error al procesar la solicitud" });
        await mEventos.addEvento(insert.insertId, "Alta", `Alta id: ${insert.insertId}, mail: ${email}`, "clientes");
        envioCorreo(nombre, email, insert.insertId, token);
        res.json({ type: "success", title: "Exito", text: "Se registró el usuario correctamente. Se envió mail para validar" });
    });
  });
  
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function envioCorreo(nombre, email, userId, token) {
  const activationUrl = `http://localhost:5001/activar-cuenta/${userId}?token=${token}`;
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'arielle.champlin83@ethereal.email',
        pass: '2927uRr3XARWN5TQZj'
    }
  });
  let mailOptions = {
    from: 'arielle.champlin83@ethereal.email',   // Remitente
    to: email,                    // Destinatario
    subject: 'Verificación de Cuenta',  // Asunto
    text: `Hola ${nombre}, tu registro fue exitoso. Por favor, activa tu cuenta haciendo clic en el siguiente enlace: ${activationUrl}`, // Contenido del correo
    html: `<p>Hola ${nombre},</p>
          <p>Tu registro fue exitoso. Para activar tu cuenta, por favor haz clic en el siguiente enlace:</p>
          <a href="${activationUrl}">Activar cuenta</a>`
  };
  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}

exports.verificarCuenta = async (req, res) => {
  const { userId } = req.params;
  const { token } = req.query;
  const user = await mIndex.getClienteById(userId);
  if (!user.length) return res.status(404).send('Usuario no encontrado');
  if (user[0].token != token) return res.status(400).send('Token inválido');
  const habilitar = await mIndex.habilitarCliente(userId);
  if (habilitar) return res.redirect('/');
  else return res.status(500).send('Error al habilitar la cuenta');
}
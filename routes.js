const router = require("express").Router()
const cIndex = require("./modules/index/controller")
const cAccesos = require("./modules/accesos/controller")
const cArticulos = require('./modules/articulos/controller');
const cUsuarios = require("./modules/usuarios/controller")
const cReportes = require('./modules/reportes/controller');
const mw = require("./middlewares")


// Inicio
router.get("/", cIndex.getInicio)
router.post('/login', cIndex.postLogin)
router.get('/logout', mw.logout)
router.get('/session', cIndex.getSession)
router.get('/home', mw.auth, cIndex.getHome)

// Pedidos
router.get('/pedidos', mw.auth, cIndex.getPedidos)
router.get('/pedidos/realizados', mw.auth, cIndex.getPedidosList)
router.get('/pedidos/detalle/:idPedido', mw.auth, cIndex.getPedidoDetalle)

// Carrito
router.get('/medios-pago', mw.auth, cIndex.getMediosPago)
router.get('/carrito', mw.auth, cIndex.getCarrito)
router.post('/carrito/guardar', mw.auth, cIndex.guardarPedido)
router.get('/session/carrito/:idArt', cIndex.getSessionCarrito)
router.post('/session/carrito', cIndex.setSessionCarrito)

// ARTICULOS
router.get('/articulo/:idArt', mw.auth, cArticulos.getArticulo);
router.get('/articulos/lista', mw.auth, mw.updateMenuInfo, cAccesos.acceso, cArticulos.getLista);
router.get('/articulos/lista/todos', cArticulos. getArticulos);
router.get('/articulos/alta', mw.auth, mw.updateMenuInfo, cAccesos.acceso, cArticulos.getAlta);
router.post('/articulos/alta', mw.auth, cArticulos.postAlta);
router.get('/articulos/modificar/:id', mw.auth, mw.updateMenuInfo, cAccesos.acceso, cArticulos.getModificar);
router.post('/articulos/modificar', mw.auth, cArticulos.postModificar);
router.post('/articulos/lista/borrar', mw.auth, cArticulos.borrar);
router.post('/articulos/precios-masivos', mw.auth, cArticulos.postPreciosMasivos);

// Reportes
router.get('/reportes/lista', mw.auth, mw.updateMenuInfo, cAccesos.acceso, cReportes.getLista);
router.get('/reportes/mas-vendidos', mw.auth, cReportes.getMasVendidos);

// PERMISOS
router.get('/accesos/lista/:id', mw.auth, mw.updateMenuInfo, cAccesos.acceso, cAccesos.getAccesos)
router.post("/updateacceso/:id_usuario/:id_menu/:acceso_short/:value", mw.auth, cAccesos.updateAcceso)

// USUARIOS
router.get('/usuarios/lista', mw.auth, mw.updateMenuInfo, cAccesos.acceso, cUsuarios.getLista)
router.get('/usuarios/alta', mw.auth, mw.updateMenuInfo, cAccesos.acceso, cUsuarios.getAlta)
router.post('/usuarios/alta', mw.auth, cUsuarios.postAlta)
router.post('/usuarios/lista/borrar', mw.auth, cUsuarios.borrar)
router.get('/usuarios/modificar/:unica', mw.auth, mw.updateMenuInfo, cAccesos.acceso, cUsuarios.getModificar)
router.post('/usuarios/modificar', mw.auth, cUsuarios.postModificar)
router.get('/changePass', mw.auth, cUsuarios.getPass)
router.post('/changePass', mw.auth, cUsuarios.postPass)
router.post('/restartPass', mw.auth, cUsuarios.restartPass)


module.exports = router
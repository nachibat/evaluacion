const fs = require("fs");
const mAccesos = require('./modules/accesos/model');

exports.auth = (req, res, next) => {
	if (req.session.auth) {
		return next()
	} else {
		res.redirect('/')
	}
}

exports.auth_ajax = (req, res, next) => {
	if (req.session.auth)
		return next()
	else
		res.sendStatus(401)
}

async function selectAction(name) {
    let action = await mAccesos.selectAction(name)
    return action[0].short
}

exports.updateMenuInfo = async (req, res, next) => {
    console.log("=============================================");
    console.log(req.route.path);
    console.log("=============================================");

    let url = req.route.path.split('/');
    let menu = await mAccesos.selectMenu(url[1].toLowerCase());
    let id_menu = menu[0].id;
    let accion = await selectAction(url[2]);

    req.session.user.id_menu = id_menu;
    req.session.user.accion = accion;
    req.session.save();
    next();
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/')
        } else {
            console.log(err)
        }
    })
}
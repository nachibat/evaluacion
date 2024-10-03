const mAccesos = require('./model');

exports.getPermisosByMenu = async (unica, nivel, menu) => {
    if (nivel.indexOf('Administrador') >= 0) return { menu, a: true, b: true, m: true, c: true };
    
    let accesos = await mAccesos.verificarAccesosAll(unica, menu);

    return accesos[0];
}

exports.getAccesos = async (req, res) => {
    const idUsuario = req.params.id;

    let menues = await mAccesos.getMenues() // select contra la tabla ayuda; 
    let accesosxusuario = await mAccesos.getAccesosPorUsuario(idUsuario);
    const lastmenuid = await mAccesos.getLastMenuId();
    const lastAccesoIdDeUsuario = await mAccesos.getLastAccesoId(idUsuario);
    lastmenuid2 = lastmenuid[0].id;
    lastAccesoIdDeUsuario2 = lastAccesoIdDeUsuario[0].menu;

    if (lastmenuid2 != lastAccesoIdDeUsuario2) {
        for (x = 0; x < menues.length; x++) {
            let secr2 = await mAccesos.verificarmenu(idUsuario, menues[x].id);
            if (secr2.length > 0) {
                console.log("ya existe este menú id " + menues[x].id + " para este usuario en Permisos");
            } else {
                await mAccesos.insertMenu(idUsuario, menues[x].id);
            }
        }

        menues = await mAccesos.getMenues();
        accesosxusuario = await mAccesos.getAccesosPorUsuario(idUsuario);
    }

    console.log("MENUES ", menues)
    console.log("USUARIO ACCESOS ", accesosxusuario);

    res.render('accesos/views/lista', {
        idUsuario,
        pagename: 'Lista de Accesos',
        menues,
        usuario_accesos: accesosxusuario
    });
}

exports.updateAcceso = async (req, res) => {
    const { id_menu, acceso_short, value, id_usuario } = req.params;
    const resultado = await mAccesos.updateAcceso(id_usuario, id_menu, acceso_short, value);
    if (!resultado.affectedRows) return res.json({ type: 'error', title: 'Error', text: 'Hubo un error al procesar la solicitud' })
    res.json({ type: 'success', title: 'Exito', text: 'Se Actualizaron permisos correctamente' });
}

exports.acceso = async (req, res, next) => {
    let id_usuario = req.session.user.id;
    const { id_menu, accion } = req.session.user;

    const user = await mAccesos.VerificarNivelAdministracion(id_usuario)
    console.log(user);
    console.log(user.length);
    if (user.length) {
        console.log("entro por administrador");
        next();
    } else {
        let acceso = await mAccesos.verificarAcceso(id_usuario, id_menu, accion)
        if (acceso != null && acceso != '') {
            if (accion == "c") acceso = acceso[0].c;
            if (accion == "a") acceso = acceso[0].a;
            if (accion == "m") acceso = acceso[0].m;
            if (accion == "b") acceso = acceso[0].b;
            if (acceso == 1) {
                next();
            } else {
                let nombre_usuario = req.session.user.nombre;
                let acciontxt = "";
                if (accion == 'a') acciontxt = "al Alta";
                if (accion == 'b') acciontxt = "a dar de Baja";
                if (accion == 'm') acciontxt = "a Modificar";
                if (accion == 'c') acciontxt = "a Consultar";

                const ayuda = await mAccesos.getAyuda(id_menu);

                res.render('accesos/views/index', {
                    pagename: 'Accesos al sistema',
                    ip: req.ip.replace(/^.*:/, ''),
                    error: `${nombre_usuario}: No tiene acceso ${acciontxt} en el menú ${ayuda[0].titulo} (id ${id_menu}). Comuniquese con el administrador.`
                });
            }
        } else {
            console.log("");
            console.log("no tiene permisos")
            console.log("");
            res.render('accesos/views/index', {
                pagename: 'Accesos al sistema',
                ip: req.ip.replace(/^.*:/, ''),
                error: `${req.session.user.nombre}: Por favor verifique sus permisos de usuario con el administrador de accesos.`
            });
        }
    }
}

exports.accesoAjax = async (req, res, next) => {
    const { id_usuario, id_menu, accion } = req.body.id_usuario;

    console.log(req.body);

    const user = await mAccesos.VerificarNivelAdministracion(id_usuario)
    if (user.length) {
        console.log("entro por administrador")
        res.send({ exito: "Usted tiene Acceso como Administrador" });
    } else {
        let acceso = await mAccesos.verificarAcceso(id_usuario, id_menu, accion);
        if (acceso != null && acceso != '') {
            console.log(acceso)
            if (accion == "c") acceso = acceso[0].c;
            if (accion == "a") acceso = acceso[0].a;
            if (accion == "m") acceso = acceso[0].m;
            if (accion == "b") acceso = acceso[0].b;
            if (acceso == 1) {
                res.send({ exito: "Usted tiene Acceso" });
            } else {
                let acciontxt = "";
                let nombre_usuario = req.session.user.nombre;
                if (accion == 'a') acciontxt = "al Alta";
                if (accion == 'b') acciontxt = "a dar de Baja";
                if (accion == 'm') acciontxt = "a Modificar";
                if (accion == 'c') acciontxt = "a Consultar";
                const ayuda = await mAccesos.getAyuda(id_menu)
                res.send({ error: `${nombre_usuario}: No tiene acceso ${acciontxt} en el menú id ${id_menu} (${ayuda[0].titulo})` });
            }
        } else {
            console.log(acceso);
            res.send({ error: `${req.session.user.nombre}: Por favor verifique sus permisos de usuario con el administrador de accesos.` });
        }
    }
}

exports.checkSuperAdminAjax = async (req, res, next) => {
    const { id_usuario } = req.body;

    const user = await mAccesos.VerificarSuperAdmin(id_usuario)
    if (user.length) {
        console.log("entro por administrador")
        res.send({ exito: "Usted tiene Acceso como Super Usuario" });
    } else {
        res.send({ error: `${req.session.user.nombre}: Por favor verifique sus permisos de usuario con el administrador de accesos.` });
    }
}

exports.checkSuperAdmin = async (req, res, next) => {
    const { id } = req.session.user;

    const user = await mAccesos.VerificarSuperAdmin(id)
    if (user.length) {
        console.log("entro por administrador")
        next();
    } else {
        res.render('accesos/views/index', { error: 'No posee permisos para acceder' });
    }
}

exports.getAyuda = async (req, res) => {
    const { id } = req.params;
    const ayuda = mAccesos.getAyuda(id);
    res.send(ayuda);
}
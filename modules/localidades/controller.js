const mLocalidades = require('./model');

exports.getAjaxByIdProvincia = async (req, res) => {
    res.send(await mLocalidades.getByIdProvincia(req.params.provincia));
}
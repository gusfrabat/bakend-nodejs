var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// =====================================
// verificar token
// =====================================
exports.verificaToken = function (req, res, next) {
  var token = req.query.token;
  jwt.verify(token, SEED, (err, decode) => {
    if (err) {
      res.status(401).json({
        ok: false,
        mensaje: 'Token incorrecto',
        errors: err
      });
    }
    req.usuario = decode.usuario;
    // res.status(200).json({
    //   ok: true,
    //   decode: decode
    // });
    next();
  });
}
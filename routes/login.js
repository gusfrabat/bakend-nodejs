// =====================================
// imports
// =====================================
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

// =====================================
// metodo del login
// =====================================
app.post('/', (rep, res) => {

  var body = rep.body;
  Usuario.findOne({email: body.email}, (err, usuarioLog) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error! login',
        error: err
      });
    }
    if (!usuarioLog) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas  - us',
        error: err
      });
    }
    if (!bcrypt.compareSync(body.password, usuarioLog.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas  -pas',
        error: err
      });
    }

    // crear un token
    usuarioLog.password = ':-)'
    var token = jwt.sign({ usuario: usuarioLog }, SEED, {expiresIn: 3600}); //1hora

    res.status(200).json({
      ok: true,
      mensaje: 'login',
      token: token,
      data: usuarioLog
    });
  });

});


module.exports = app;
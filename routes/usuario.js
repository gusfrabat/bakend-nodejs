// imports
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/auth')

var app = express();
var Usuario = require('../models/usuario');

// Rutas principal

// =====================================
// Obtener todos los usuarios
// =====================================
app.get('/', (req, res, next) => {
  Usuario.find({}, 'nombres apellidos role img email')
    .exec(
      (err, usuario) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error base de datos',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          mensaje: 'Petición realizada correctamente  ',
          data: usuario
        });
      });
});

// =====================================
// Actualizar usuario
// =====================================
app.put('/:id', mdAuth.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        error: err
      });
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error usuario invalido' + id,
        error: err
      });
    }
    usuario.nombres = body.nombres,
      usuario.apellidos = body.apellidos,
      usuario.role = body.role,
      usuario.email = body.email,

      usuario.save((err, usuarioGuardado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error al actualizar usuario',
            error: err
          });
        }
        usuario.password = ':-)'
        res.status(200).json({
          ok: true,
          mensaje: 'Usuario actualizado',
          usuario: usuarioGuardado
        });
      });
  });
});


// =====================================
// crear un nuevo ususario
// =====================================
app.post('/', mdAuth.verificaToken, (req, res) => {
  var body = req.body;
  var usuario = new Usuario({
    nombres: body.nombres,
    apellidos: body.apellidos,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear el usuario',
        error: err
      });
    }
    usuario.password = ':-)'
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario creado',
      data: usuarioGuardado,
      decode: req.usuario
    });
  });
});

// =====================================
// Eliminar usuario por el id
// =====================================
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
  var id = req.params.id;
  Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        error: err
      });
    }
    if (!usuarioEliminado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No exite usuario con ese id',
        error: {
          message: 'no exixte el usuario'
        }
      });
    }
    res.status(200).json({
      ok: true,
      mensaje: 'Usuario eliminado',
      data: usuarioEliminado
    });
  });
});

module.exports = app;
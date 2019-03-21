// imports
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/auth');

var app = express();
var Hospital = require('../models/hospital');

// Rutas principal

// =====================================
// crear un nuevo hospital
// =====================================
app.post('/', mdAuth.verificaToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear el hospital',
        error: err
      });
    }
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario creado',
      data: hospitalGuardado,
      decode: req.usuario
    });
  });
});

// =====================================
// Actualizar hospitales
// =====================================
app.put('/:id', mdAuth.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar el hospital',
        error: err
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error hospital invalido' + id,
        error: err
      });
    }
    hospital.nombre = body.nombre,
    hospital.img = body.img

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar hospital',
          error: err
        });
      }
      hospital.password = ':-)'
      res.status(200).json({
        ok: true,
        mensaje: 'hospital actualizado',
        hospital: hospitalGuardado
      });
      });
  });
});

// =====================================
// Eliminar hospital por el id
// =====================================
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
  var id = req.params.id;
  Hospital.findByIdAndDelete(id, (err, hospitalEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar hospital',
        error: err
      });
    }
    if (!hospitalEliminado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No exite hospital con ese id',
        error: {
          message: 'no exixte el hospital'
        }
      });
    }
    res.status(200).json({
      ok: true,
      mensaje: 'hospital eliminado',
      data: hospitalEliminado
    });
  });
});


// =====================================
// Obtener todos los ospitales
// =====================================
app.get('/', (req, res, next) => {
  Hospital.find({}, 'nombre usuario')
    .exec(
      (err, hospital) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error base de datos',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          mensaje: 'Petición realizada correctamente',
          data: hospital
        });
      });
});

module.exports = app;
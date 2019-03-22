// imports
var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuth = require('../middlewares/auth');

var app = express();
var Medico = require('../models/medico');

// =====================================
// Obtener todos los medicos
// =====================================
app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  if (desde > 0) {
    desde = desde - 1;
  }
  desde = Number(desde);

  Medico.find({}, 'nombre img usuario hospital')
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombres apellidos email')
    .populate('hospital')
    .exec(
      (err, medico) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error base de datos',
            errors: err
          });
        }
        Medico.count({}, (err, count) => {

          res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente  ',
            data: medico,
            count: count
          });
        });
      });
});

// =====================================
// crear un nuevo medico
// =====================================

app.post('/', mdAuth.verificaToken, (req, res) => {
  var body = req.body;
  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear el medico',
        error: err
      });
    }
    res.status(201).json({
      ok: true,
      mensaje: 'Medico creado',
      data: medicoGuardado,
    });
  });
});

// =====================================
// Actualizar medico
// =====================================
app.put('/:id', mdAuth.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar medico',
        error: err
      });
    }
    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error medico invalido' + id,
        error: err
      });
    }
    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar medico',
          error: err
        });
      }
      res.status(200).json({
        ok: true,
        mensaje: 'medico actualizado',
        medico: medicoGuardado
      });
    });
  });
});

// =====================================
// Eliminar medico por el id
// =====================================
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
  var id = req.params.id;
  Medico.findByIdAndDelete(id, (err, medicoEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar medico',
        error: err
      });
    }
    if (!medicoEliminado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe medico con ese id',
        error: {
          message: 'no existe el medico'
        }
      });
    }
    res.status(200).json({
      ok: true,
      mensaje: 'medico eliminado',
      data: medicoEliminado
    });
  });
});





module.exports = app;
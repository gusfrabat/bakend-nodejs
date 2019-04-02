// imports
var express = require('express');

var mdAuth = require('../middlewares/auth');

var app = express();
var Hospital = require('../models/hospital');

// Rutas principal

// =====================================
// Obtener todos los hospitales
// =====================================
app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  if (desde > 0) {
    desde = desde - 1;
  }
  desde = Number(desde);

  Hospital.find({})
    .populate('usuario', 'nombres apellidos email')
    .skip(desde)
    .limit(5)
    .exec(
      (err, hospital) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error base de datos',
            errors: err
          });
        }
        Hospital.count({}, (err, count) => {
          res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente',
            data: hospital,
            count: count
          });
        });
      });
});

// =====================================
// crear un nuevo hospital
// =====================================
app.post('/', mdAuth.verificaToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    nombre: body.nombre,
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
      mensaje: 'Hospila creado',
      data: hospitalGuardado,
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
    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar hospital',
          error: err
        });
      }
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
        mensaje: 'No existe hospital con ese id',
        error: {
          message: 'no existe el hospital'
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
// Taer hospitales por el ID
// =====================================
app.get('/:id', (req, res) => {
  var id = rep.params.id;
  Hospital.findById(id)
    .populate('usuario', 'nombres apellidos img email')
    .exec((err, hospital) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar hospital',
          error: err
        });
      }
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El hospital con este id no existe',
          error: err
        });
      }
      res.status(200).json({
        ok: true,
        hospital: hospital
      });
    });
});


module.exports = app;
// imports
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();


var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


// default options
app.use(fileUpload());


// Rutas principal
app.put('/:tipo/:id', (req, res, next) => {
  var tipo = req.params.tipo;
  var id = req.params.id;
  // tipos de coleccion 
  var tiposValidos = ['hospitales', 'usuarios', 'medicos'];
  if (tiposValidos.indexOf(tipo) < 0) {
    res.status(400).json({
      ok: false,
      mensaje: 'Tipo de colección no valida',
      error: {
        mesagge: 'Solo se permiten estas colecciónes ' + tiposValidos
      }
    });
  }
  if (!req.files) {
    res.status(400).json({
      ok: false,
      mensaje: 'imagen no encontrada',
      error: {
        mesagge: 'Debe de seleccionar una imagen'
      }
    });
  }
  // obtener nombre del archivo
  var archivo = req.files.imagen;
  var nombreImg = archivo.name.split('.');
  var extArcivo = nombreImg[nombreImg.length - 1];
  // solo estas extensiones son valida
  var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  if (extensionesValidas.indexOf(extArcivo) < 0) {
    res.status(400).json({
      ok: false,
      mensaje: 'Extencion no valida',
      error: {
        mesagge: 'Solo se permiten estas extensiones ' + extensionesValidas.join(', ')
      }
    });
  }
  // nombre de archivo personalizado
  // #a123123$213-123.png
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extArcivo}`;
  // mover el achivo temporal
  var paht = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(paht, err => {
    if (err) {
      res.status(500).json({
        ok: false,
        mensaje: 'Error al mover archivo',
      });
    }
    SubirPorTipo(tipo, id, nombreArchivo, res);
  });
});
function SubirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === 'usuarios') {
    Usuario.findById(id, (err, usuario) => {
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El usuario no existe',
          error: err
        });
      }
      var pahtViejo = './uploads/usuarios/' + usuario.img;
      if (fs.existsSync(pahtViejo)) {
        fs.unlinkSync(pahtViejo);
      }
      usuario.img = nombreArchivo;
      usuario.save( (err, usuarioActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de usuario actualizada',
          usuario: usuarioActualizado
        });
      });
    });
  }
  if (tipo === 'medicos') {
    Medico.findById(id, (err, medico) => {
      if (!medico) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El medico no existe',
          error: err
        });
      }
      var pahtViejo = './uploads/medicos/' + medico.img;
      if (fs.existsSync(pahtViejo)) {
        fs.unlinkSync(pahtViejo);
      }
      medico.img = nombreArchivo;
      medico.save( (err, medicoActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de medico actualizada',
          medico: medicoActualizado
        });
      });
    });
  }
  if (tipo === 'hospitales') {
    Hospital.findById(id, (err, hospital) => {
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El hospital no existe',
          error: err
        });
      }
      var pahtViejo = './uploads/hospitales/' + hospital.img;
      if (fs.existsSync(pahtViejo)) {
        fs.unlinkSync(pahtViejo);
      }
      hospital.img = nombreArchivo;
      hospital.save((err, hospitalActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de hospital actualizada',
          hospital: hospitalActualizado
        });
      });
    });
  }
};


module.exports = app;
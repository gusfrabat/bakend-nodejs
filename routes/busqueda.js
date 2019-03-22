// imports
var express = require("express");
var app = express();
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

// Rutas principal

// =====================================
// Ruta pasa buscar hospitales
// =====================================
app.get('/hospital/:busqueda', (req, res) => {
  var busqueda = req.params.busqueda;
  var regu = new RegExp(busqueda, "i");
  buscarHospitales(regu).then(hospitales => {
    res.status(200).json({
      ok: true,
      mensaje: 'Peticion realizada correctamente',
      hospitales: hospitales
    });
  });
});
// =====================================
// Ruta pasa buscar usuarios
// =====================================
app.get('/usuario/:busqueda', (req, res) => {
  var busqueda = req.params.busqueda;
  var regu = new RegExp(busqueda, "i");
  buscarUsuarios(regu).then(usuarios => {
    res.status(200).json({
      ok: true,
      mensaje: 'Peticion realizada correctamente',
      usuarios: usuarios
    });
  });
});
// =====================================
// Ruta pasa buscar medicos
// =====================================
app.get('/medico/:busqueda', (req, res) => {
  var busqueda = req.params.busqueda;
  var regu = new RegExp(busqueda, "i");
  buscarMedicos(regu).then(medicos => {
    res.status(200).json({
      ok: true,
      mensaje: 'Peticion realizada correctamente',
      medicos: medicos
    });
  });
});

// =====================================
// Busqueda por coleccion con case
// =====================================
app.get('/colecciones/:tabla/:busqueda', (req, res, next) => {

  var busqueda = req.params.busqueda;
  var tabla = req.params.tabla
  var regu = new RegExp(busqueda, "i");

  var promesa;

  switch (tabla) {
    case 'usuarios':
      promesa = buscarUsuarios(regu);
      break;
    case 'medicos':
      promesa = buscarMedicos(regu);
      break;
    case 'hospitales':
      promesa = buscarHospitales(regu);
      break;
    default:
      return res.status(400).json({
        ok: false,
        mensaje: 'Los tipos de busqueda son unicamente medicos usuarios y hospitales',
        erroe: {
          message: 'error en la ruta'
        }
      });
  }
  promesa.then( data => {
    res.status(200).json({
      ok: true,
      mensaje: 'Peticion realizada correctamente',
      [tabla]: data,
    });
  });
});

// =====================================
// Ruta para buscar en cualquier colección de la base de datos
// =====================================
app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regu = new RegExp(busqueda, "i");

  Promise.all([
    buscarHospitales(regu),
    buscarMedicos(regu),
    buscarUsuarios(regu)
  ]).then(respuestas => {
    res.status(200).json({
      ok: true,
      mensaje: "Peticion realizada correctamente",
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2]
    });
  });
});

// =====================================
// buscar hospitales en Bd
// =====================================
function buscarHospitales(regu) {
  return new Promise((resolve, reject) => {
    Hospital.find({
        nombre: regu
      })
      .populate("usuario", "nombres apellidos email")
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al cargar hospitales", err);
        } else {
          resolve(hospitales);
        }
      });
  });
}

// =====================================
// Buscar medicos en Bd
// =====================================
function buscarMedicos(regu) {
  return new Promise((resolve, reject) => {
    Medico.find({
        nombre: regu
      })
      .populate("usuario", "nombres apellidos email")
      .populate("hospital", "nombre")
      .exec((err, medicos) => {
        if (err) {
          reject("Error al cargar medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

// =====================================
// Buscar usuarios en la Bd
// =====================================
function buscarUsuarios(regu) {
  return new Promise((resolve, reject) => {
    Usuario.find()
      .or([{
          usuarios: regu
        },
        {
          apellidos: regu
        },
        {
          email: regu
        }
      ])
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al cargar usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = app;
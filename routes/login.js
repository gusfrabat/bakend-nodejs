// =====================================
// imports
// =====================================
var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var app = express();
var Usuario = require("../models/usuario");


// =====================================
// Google
// =====================================
var CLIENT_ID = require("../config/config").CLIENT_ID;
const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// =====================================
// Metodo login Google
// =====================================
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  var nombres = payload.name.split(' ');
  return {
    nombres: nombres[0],
    apellidos: nombres[1],
    email: payload.email,
    img: payload.picture,
    google: true,
  }
}


app.post('/google', async (req, res) => {

  var token = req.body.token;
  var googleUser = await verify(token)
    .catch(e => {
      res.status(403).json({
        ok: false,
        mensaje: ' token no valido'
      });
    });

  Usuario.findOne({
    email: googleUser.email
  }, (err, usuarioDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error! login",
        error: err
      });
    }
    if (usuarioDb) {
      if (usuarioDb.google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe de usar su autenticacion normal"
        });
      } else {
        var token = jwt.sign({
          usuario: usuarioDb
        }, SEED, {
          expiresIn: 15600
        }); //1hora

        res.status(200).json({
          ok: true,
          data: usuarioDb,
          token: token,
        });
      }
    } else {
      // usuario no existe crear en base de datos
      var usuario = new Usuario();
      usuario.nombres = googleUser.nombres;
      usuario.apellidos = googleUser.apellidos;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':-)';

      usuario.save((err, usuarioDb) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error! login",
            error: err
          });
        }
        var token = jwt.sign({
          usuario: usuarioDb
        }, SEED, {
          expiresIn: 15600
        }); //1hora

        res.status(200).json({
          ok: true,
          data: usuarioDb,
          token: token,
        });
      });
    }
  });



  // res.status(200).json({
  //   ok: true,
  //   mensaje: 'Ok!!!',
  //   googleUser: googleUser
  // });
});



// =====================================
// metodo del login
// =====================================
app.post("/", (rep, res) => {
  var body = rep.body;
  Usuario.findOne({
    email: body.email
  }, (err, usuarioDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error! login",
        error: err
      });
    }
    if (!usuarioDb) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas  - us",
        error: err
      });
    }
    if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas  -pas",
        error: err
      });
    }
    // crear un token
    usuarioDb.password = ":-)";
    var token = jwt.sign({
      usuario: usuarioDb
    }, SEED, {
      expiresIn: 15600
    }); //1hora

    res.status(200).json({
      ok: true,
      mensaje: "login",
      token: token,
      data: usuarioDb
    });
  });
});

module.exports = app;
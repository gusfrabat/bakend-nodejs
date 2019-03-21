var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var rolesValidos = {
  values: [
    'ADMIN_ROL',
    'USER_ROL'
  ],
  message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
  nombres: {type: String, required: [true, 'El nombre es requerido']},
  apellidos: {type: String, required: [true, 'El apellido es requerido']},
  email: {type: String, unique: true, required: [true, 'El correo es requerido']},
  password: {type: String, required: [true, 'La contraseña es requerido']},
  img: {type: String, required: false},
  role: {type: String, required: true, default: 'USER_ROL', enum: rolesValidos},
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} debe ser unico'});

module.exports = mongoose.model('usuario', usuarioSchema);
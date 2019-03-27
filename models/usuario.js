var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');
var rolesValidos = {
  values: [
    'ADMIN_ROL',
    'USER_ROL'
  ],
  message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
  nombres: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  apellidos: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es requerido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerido']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROL',
    enum: rolesValidos
  },
  google: {type: Boolean, default: false}
});

usuarioSchema.plugin(uniqueValidator, {
  message: 'El {PATH} debe ser unico'
});

module.exports = mongoose.model('Usuario', usuarioSchema);
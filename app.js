//librerias requerias para funcionar 
// =====================================
// Requires
// =====================================
var express= require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// =====================================
// inicializar variables
// =====================================
var app = express();

// =====================================
// corss Avilitadas
// =====================================
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS")
  next();
});



// =====================================
// bodyParse application/x-www-form-urlencoded
// =====================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// =====================================
// Importar rutas
// =====================================
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenRoutes = require('./routes/imagen');


// =====================================
// conexión base de datos mongo
// =====================================
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDb', (err, res) => {
  if (err) throw err;
  console.log('Base de datos:\x1b[32m%s\x1b[0m',' Online');
})

// =====================================
// Rutas
// =====================================
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenRoutes);
app.use('/', appRoutes);

// =====================================
// Escuchar peticiones
// =====================================
app.listen(3000, () => {
  console.log('Corriendo en el puerto 3000:\x1b[32m%s\x1b[0m',' Online');
});

// colores para consola Reset = "\x1b[0m" Bright = "\x1b[1m" Dim = "\x1b[2m" Underscore = "\x1b[4m" Blink = "\x1b[5m" Reverse = "\x1b[7m" Hidden = "\x1b[8m" FgBlack = "\x1b[30m" FgRed = "\x1b[31m" FgGreen = "\x1b[32m" FgYellow = "\x1b[33m" FgBlue = "\x1b[34m" FgMagenta = "\x1b[35m" FgCyan = "\x1b[36m" FgWhite = "\x1b[37m" BgBlack = "\x1b[40m" BgRed = "\x1b[41m" BgGreen = "\x1b[42m" BgYellow = "\x1b[43m" BgBlue = "\x1b[44m" BgMagenta = "\x1b[45m" BgCyan = "\x1b[46m" BgWhite = "\x1b[47m"
//console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online'); 
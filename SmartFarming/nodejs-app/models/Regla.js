const mongoose = require('mongoose');

const ReglaSchema = new mongoose.Schema({
  condiciones: [
    {
      sensor_nombre: String,
      operador: String,
      valor: Number
    }
  ],
  acciones: [
    {
      actuador_nombre: String,
      accion: String
    }
  ]
});

module.exports = mongoose.model('Regla', ReglaSchema);

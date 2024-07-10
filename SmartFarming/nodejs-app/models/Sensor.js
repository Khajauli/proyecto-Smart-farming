const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  ubicacion: { type: String, required: true },
  configuracion: {
    intervaloLectura: { type: Number, required: true },
    unidad: { type: String, required: true },
    intervaloActuadores: { type: Number } 
  }
}, { collection: 'sensores' });

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;

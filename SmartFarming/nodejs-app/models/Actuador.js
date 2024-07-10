const mongoose = require('mongoose');

const actuadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  ubicacion: { type: String, required: true },
  estado: { type: Boolean, default: false } // Estado inicial apagado
}, { collection: 'actuadores' });

actuadorSchema.methods.encender = async function () {
  if (!this.estado) {
    this.estado = true;
    await this.save();
    return true; // Devuelve true si el actuador se encendió correctamente
  }
  return false; // Devuelve false si el actuador ya estaba encendido
};

actuadorSchema.methods.apagar = async function () {
  if (this.estado) {
    this.estado = false;
    await this.save();
    return true; // Devuelve true si el actuador se apagó correctamente
  }
  return false; // Devuelve false si el actuador ya estaba apagado
};

const Actuador = mongoose.model('Actuador', actuadorSchema);

module.exports = Actuador;

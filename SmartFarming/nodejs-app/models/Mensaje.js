const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  tema: String,
  mensaje: String,
  fechaHora: { type: Date, default: Date.now },
  expiraEn: { 
    type: Date, 
    default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // caduca en 15 días
    index: { expires: '15d' } // índice TTL
  }
});


// Método estático para modificar el tiempo de caducidad de todos los mensajes
mensajeSchema.statics.modificarTiempoCaducidadGlobal = async function(nuevoTiempoCaducidad) {
  try {
    await this.updateMany({}, {
      $set: { expiraEn: new Date(Date.now() + nuevoTiempoCaducidad) }
    }).exec();
    return true;
  } catch (error) {
    throw new Error('Error al modificar el tiempo de caducidad global de los mensajes');
  }
};

// Método estático para desactivar la expiración de todos los mensajes
mensajeSchema.statics.desactivarExpiracionGlobal = async function() {
  try {
    await this.updateMany({}, {
      $unset: { expiraEn: 1 }
    }).exec();
    return true;
  } catch (error) {
    throw new Error('Error al desactivar la expiración global de los mensajes');
  }
};

// Método estático para activar la expiración de todos los mensajes con un tiempo específico
mensajeSchema.statics.activarExpiracionGlobal = async function(tiempoExpiracion) {
  try {
    await this.updateMany({}, {
      $set: { expiraEn: new Date(Date.now() + tiempoExpiracion) }
    }).exec();
    return true;
  } catch (error) {
    throw new Error('Error al activar la expiración global de los mensajes con tiempo específico');
  }
};


const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;

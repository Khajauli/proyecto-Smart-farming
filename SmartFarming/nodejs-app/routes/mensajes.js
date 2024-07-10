const express = require('express');
const router = express.Router();
const Mensaje = require('../models/Mensaje'); 
const Sensor = require('../models/Sensor');

// Ruta para buscar mensajes por fecha
router.get('/fecha/:fecha', async (req, res) => {
  const { fecha } = req.params;
  const fechaInicio = new Date(fecha);
  fechaInicio.setHours(0, 0, 0, 0); // Establece la hora de inicio del día
  const fechaFin = new Date(fecha);
  fechaFin.setHours(23, 59, 59, 999); // Establece la hora de fin del día

  try {
    const mensajes = await Mensaje.find({
      fechaHora: { $gte: fechaInicio, $lte: fechaFin } 
    }).exec();
    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por fecha:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por fecha' });
  }
});

// Otras rutas similares
router.get('/hongos/:fecha', async (req, res) => {
  const { fecha } = req.params;
  const fechaInicio = new Date(fecha);
  fechaInicio.setHours(0, 0, 0, 0);
  const fechaFin = new Date(fecha);
  fechaFin.setHours(23, 59, 59, 999);

  try {
    const mensajes = await Mensaje.find({
      fechaHora: { $gte: fechaInicio, $lte: fechaFin },
      tema: { $in: ['HUMEDADH', 'TEMPERATURAH', 'CO2H'] } 
    }).exec();
    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por fecha:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por fecha' });
  }
});

router.get('/tomateswifi/:fecha', async (req, res) => {
  const { fecha } = req.params;
  const fechaInicio = new Date(fecha);
  fechaInicio.setHours(0, 0, 0, 0);
  const fechaFin = new Date(fecha);
  fechaFin.setHours(23, 59, 59, 999);

  try {
    const mensajes = await Mensaje.find({
      fechaHora: { $gte: fechaInicio, $lte: fechaFin },
      tema: { $in: ['HUMEDADTW', 'TEMPERATURATW'] }
    }).exec();
    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por fecha:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por fecha' });
  }
});

router.get('/tomateslora/:fecha', async (req, res) => {
  const { fecha } = req.params;
  const fechaInicio = new Date(fecha);
  fechaInicio.setHours(0, 0, 0, 0);
  const fechaFin = new Date(fecha);
  fechaFin.setHours(23, 59, 59, 999);

  try {
    const mensajes = await Mensaje.find({
      fechaHora: { $gte: fechaInicio, $lte: fechaFin },
      tema: { $in: ['HUMEDADTL', 'TEMPERATURATL'] }
    }).exec();
    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por fecha:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por fecha' });
  }
});

// Ruta para buscar mensajes por intervalo de tiempo
router.get('/intervalo/:hora', async (req, res) => {
  const { hora } = req.params;
  const horaActual = new Date();
  const horaInicio = new Date(hora);
  horaInicio.setMinutes(horaInicio.getMinutes() - 5); // Resta 5 minutos a la hora proporcionada

  try {
    const mensajes = await Mensaje.find({
      fechaHora: { $gte: horaInicio, $lte: horaActual }
    }).exec();
    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por intervalo de tiempo:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por intervalo de tiempo' });
  }
});

// Buscar mensajes por tema y fecha
router.get('/tema/:tema/fecha/:fecha', async (req, res) => {
  const { tema, fecha } = req.params;

  // Convertir la fecha recibida en objetos Date para inicio y fin del día
  const fechaInicio = new Date(fecha);
  fechaInicio.setHours(0, 0, 0, 0); // Establecer hora de inicio del día
  const fechaFin = new Date(fecha);
  fechaFin.setHours(23, 59, 59, 999); // Establecer hora de fin del día

  try {
    const mensajes = await Mensaje.find({
      tema: tema,
      fechaHora: { $gte: fechaInicio, $lte: fechaFin }
    }).exec();
    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por tema y fecha:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por tema y fecha' });
  }
});

// Ruta para buscar mensajes por tema
router.get('/tema/:tema', async (req, res) => {
  const { tema } = req.params;

  try {
    // Buscar todos los mensajes con el tema especificado
    const mensajes = await Mensaje.find({ tema: tema }).exec();
    
    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por tema:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por tema' });
  }
});


// Ruta para buscar mensajes por ubicación y fecha de mensaje
router.get('/ubicacion/:ubicacion/fecha/:fecha', async (req, res) => {
  const { ubicacion, fecha } = req.params;

  try {
    // Buscar todos los sensores en la ubicación especificada
    const sensores = await Sensor.find({ ubicacion: ubicacion });

    // Obtener los nombres de los sensores encontrados
    const nombresSensores = sensores.map(sensor => sensor.nombre);

    // Convertir la fecha recibida en objetos Date para inicio y fin del día
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0); // Establecer hora de inicio del día
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999); // Establecer hora de fin del día

    // Buscar mensajes que correspondan a los nombres de los sensores en la ubicación y fecha
    const mensajes = await Mensaje.find({
      tema: { $in: nombresSensores },
      fechaHora: { $gte: fechaInicio, $lte: fechaFin }
    }).exec();

    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por ubicación y fecha:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por ubicación y fecha' });
  }
});

// Ruta para buscar mensajes por ubicación de sensores
router.get('/ubicacion/:ubicacion', async (req, res) => {
  const { ubicacion } = req.params;

  try {
    // Buscar todos los sensores en la ubicación especificada
    const sensores = await Sensor.find({ ubicacion: ubicacion });

    // Obtener los nombres de los sensores encontrados
    const nombresSensores = sensores.map(sensor => sensor.nombre);

    // Buscar mensajes que correspondan a los nombres de los sensores en la ubicación
    const mensajes = await Mensaje.find({
      tema: { $in: nombresSensores }
    }).exec();

    res.json(mensajes);
  } catch (error) {
    console.error('Error al buscar mensajes por ubicación:', error);
    res.status(500).json({ error: 'Error al buscar mensajes por ubicación' });
  }
});

// Ruta para modificar el tiempo de caducidad global de todos los mensajes
router.put('/modificar-caducidad-global', async (req, res) => {
  const { nuevoTiempoCaducidad } = req.body;

  try {
    await Mensaje.modificarTiempoCaducidadGlobal(nuevoTiempoCaducidad);
    res.json({ mensaje: 'Tiempo de caducidad modificado globalmente correctamente' });
  } catch (error) {
    console.error('Error al modificar el tiempo de caducidad global:', error);
    res.status(500).json({ error: 'Error al modificar el tiempo de caducidad global de los mensajes' });
  }
});

// Ruta para desactivar la expiración global de todos los mensajes
router.put('/desactivar-expiracion-global', async (req, res) => {
  try {
    await Mensaje.desactivarExpiracionGlobal();
    res.json({ mensaje: 'Expiración desactivada globalmente correctamente' });
  } catch (error) {
    console.error('Error al desactivar la expiración global:', error);
    res.status(500).json({ error: 'Error al desactivar la expiración global de los mensajes' });
  }
});

// Ruta para activar la expiración global de todos los mensajes con un tiempo específico
router.put('/activar-expiracion-global', async (req, res) => {
  const { tiempoExpiracion } = req.body;

  try {
    await Mensaje.activarExpiracionGlobal(tiempoExpiracion);
    res.json({ mensaje: 'Expiración activada globalmente con tiempo específico correctamente' });
  } catch (error) {
    console.error('Error al activar la expiración global con tiempo específico:', error);
    res.status(500).json({ error: 'Error al activar la expiración global de los mensajes con tiempo específico' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');
const servicioMqtt = require('../services/mqttService');

// Crear un nuevo sensor
router.post('/', async (req, res) => {
  const { nombre, tipo, ubicacion, configuracion } = req.body;

  try {
    const nuevoSensor = new Sensor({ nombre, tipo, ubicacion, configuracion });
    await nuevoSensor.save();
    servicioMqtt.suscribirseNuevoTema(nombre);
    res.status(201).json(nuevoSensor);
  } catch (error) {
    console.error('Error guardando el sensor:', error);
    res.status(500).json({ error: 'Error guardando el sensor', details: error });
  }
});

// Leer todos los sensores
router.get('/', async (req, res) => {
  try {
    const sensores = await Sensor.find();
    res.status(200).json(sensores);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo los sensores', details: err });
  }
});

// Leer un sensor por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sensor = await Sensor.findById(id);
    if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });
    res.status(200).json(sensor);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo el sensor', details: err });
  }
});

// Actualizar un sensor por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, ubicacion, configuracion } = req.body;

  try {
    const sensor = await Sensor.findByIdAndUpdate(id, { nombre, tipo, ubicacion, configuracion }, { new: true });
    if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });
    res.status(200).json({ message: 'Sensor actualizado exitosamente', sensor });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando el sensor', details: err });
  }
});

// Borrar un sensor por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sensor = await Sensor.findByIdAndDelete(id);
    if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });
    res.status(200).json({ message: 'Sensor borrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error borrando el sensor', details: err });
  }
});
// Obtener sensores por ubicación
router.get('/ubicacion/:ubicacion', async (req, res) => {
  const { ubicacion } = req.params;

  try {
    const sensores = await Sensor.find({ ubicacion });
    res.status(200).json(sensores);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo los sensores por ubicación', details: err });
  }
});

// Función para controlar el sensor por nombre y valor booleano
router.post('/controlar', async (req, res) => {
  const { nombre, valor } = req.body; // Valor esperado: 0 o 1

  try {
    const sensor = await Sensor.findOne({ nombre });
    if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });

    // Llamar a la función para controlar el sensor vía MQTT
    await controlarSensor(nombre, valor);

    res.status(200).json({ message: `Control del sensor ${nombre} enviado correctamente` });
  } catch (error) {
    console.error('Error al controlar el sensor:', error);
    res.status(500).json({ error: 'Error al controlar el sensor', details: error });
  }
});
module.exports = router;

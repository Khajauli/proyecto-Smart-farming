const express = require('express');
const router = express.Router();
const Regla = require('../models/Regla');
const Sensor = require('../models/Sensor');
const Actuador = require('../models/Actuador');

// Crear una nueva regla
router.post('/', async (req, res) => {
  const { nombre, condiciones, acciones } = req.body;

  try {
    // Verificar que los nombres de sensores y actuadores existan
    await Promise.all(condiciones.map(async condicion => {
      const sensor = await Sensor.findOne({ nombre: condicion.sensor_nombre });
      if (!sensor) throw new Error(`Sensor con nombre ${condicion.sensor_nombre} no encontrado`);
    }));

    await Promise.all(acciones.map(async accion => {
      const actuador = await Actuador.findOne({ nombre: accion.actuador_nombre });
      if (!actuador) throw new Error(`Actuador con nombre ${accion.actuador_nombre} no encontrado`);
    }));

    const nuevaRegla = new Regla({ nombre, condiciones, acciones });
    await nuevaRegla.save();
    res.status(201).json(nuevaRegla);
  } catch (error) {
    console.error('Error creando la regla:', error);
    res.status(500).json({ error: 'Error creando la regla', details: error.message });
  }
});

// Leer todas las reglas
router.get('/', async (req, res) => {
  try {
    const reglas = await Regla.find().populate('condiciones.sensor_nombre').populate('acciones.actuador_nombre');
    res.status(200).json(reglas);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo las reglas', details: err });
  }
});

// Leer una regla por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const regla = await Regla.findById(id).populate('condiciones.sensor_nombre').populate('acciones.actuador_nombre');
    if (!regla) return res.status(404).json({ message: 'Regla no encontrada' });
    res.status(200).json(regla);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo la regla', details: err });
  }
});

// Actualizar una regla por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, condiciones, acciones } = req.body;

  try {
    // Verificar que los nombres de sensores y actuadores existan
    await Promise.all(condiciones.map(async condicion => {
      const sensor = await Sensor.findOne({ nombre: condicion.sensor_nombre });
      if (!sensor) throw new Error(`Sensor con nombre ${condicion.sensor_nombre} no encontrado`);
    }));

    await Promise.all(acciones.map(async accion => {
      const actuador = await Actuador.findOne({ nombre: accion.actuador_nombre });
      if (!actuador) throw new Error(`Actuador con nombre ${accion.actuador_nombre} no encontrado`);
    }));

    const reglaActualizada = await Regla.findByIdAndUpdate(id, { nombre, condiciones, acciones }, { new: true })
      .populate('condiciones.sensor_nombre')
      .populate('acciones.actuador_nombre');

    if (!reglaActualizada) return res.status(404).json({ message: 'Regla no encontrada' });

    res.status(200).json({ message: 'Regla actualizada exitosamente', regla: reglaActualizada });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando la regla', details: err });
  }
});

// Borrar una regla por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const regla = await Regla.findByIdAndDelete(id);
    if (!regla) return res.status(404).json({ message: 'Regla no encontrada' });
    res.status(200).json({ message: 'Regla borrada exitosamente' });
  } catch (err) {
    res.status (500).json({ error: 'Error borrando la regla', details: err });
  }
});

module.exports = router;

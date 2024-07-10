const express = require('express');
const router = express.Router();
const Actuador = require('../models/Actuador');

// Crear un nuevo actuador
router.post('/', async (req, res) => {
  const { nombre, tipo, ubicacion } = req.body;

  try {
    const nuevoActuador = new Actuador({ nombre, tipo, ubicacion });
    await nuevoActuador.save();
    res.status(201).json(nuevoActuador);
  } catch (error) {
    console.error('Error guardando el actuador:', error);
    res.status(500).json({ error: 'Error guardando el actuador', details: error });
  }
});

// Leer todos los actuadores
router.get('/', async (req, res) => {
  try {
    const actuadores = await Actuador.find();
    res.status(200).json(actuadores);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo los actuadores', details: err });
  }
});

// Leer un actuador por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const actuador = await Actuador.findById(id);
    if (!actuador) return res.status(404).json({ message: 'Actuador no encontrado' });
    res.status(200).json(actuador);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo el actuador', details: err });
  }
});

// Actualizar un actuador por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, ubicacion, configuracion } = req.body;

  try {
    const actuador = await Actuador.findByIdAndUpdate(id, { nombre, tipo, ubicacion,estado }, { new: true });
    if (!actuador) return res.status(404).json({ message: 'Actuador no encontrado' });
    res.status(200).json({ message: 'Actuador actualizado exitosamente', actuador });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando el actuador', details: err });
  }
});

// Borrar un actuador por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const actuador = await Actuador.findByIdAndDelete(id);
    if (!actuador) return res.status(404).json({ message: 'Actuador no encontrado' });
    res.status(200).json({ message: 'Actuador borrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error borrando el actuador', details: err });
  }
});

// Obtener actuadores por ubicación
router.get('/ubicacion/:ubicacion', async (req, res) => {
  const { ubicacion } = req.params;

  try {
    const actuadores = await Actuador.find({ ubicacion });
    res.status(200).json(actuadores);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo los actuadores por ubicación', details: err });
  }
});

// Función para controlar el actuador por nombre y valor booleano
router.post('/controlar', async (req, res) => {
  const { nombre, valor } = req.body; // Valor esperado: 0 o 1

  try {
    const actuador = await Actuador.findOne({ nombre });
    if (!actuador) return res.status(404).json({ message: 'Actuador no encontrado' });

    if (valor === 1) {
      // Encender el actuador si está apagado
      const encendido = await actuador.encender();
      if (encendido) {
        await controlarActuador(nombre, 1); // Enviar mensaje MQTT para encender
        res.status(200).json({ message: `Actuador ${nombre} encendido` });
      } else {
        res.status(200).json({ message: `El actuador ${nombre} ya estaba encendido` });
      }
    } else if (valor === 0) {
      // Apagar el actuador si está encendido
      const apagado = await actuador.apagar();
      if (apagado) {
        await controlarActuador(nombre, 0); // Enviar mensaje MQTT para apagar
        res.status(200).json({ message: `Actuador ${nombre} apagado` });
      } else {
        res.status(200).json({ message: `El actuador ${nombre} ya estaba apagado` });
      }
    } else {
      res.status(400).json({ error: 'El valor debe ser 0 o 1' });
    }
  } catch (error) {
    console.error('Error al controlar el actuador:', error);
    res.status(500).json({ error: 'Error al controlar el actuador', details: error });
  }
});

// Función para obtener el estado de un actuador por nombre
router.get('/estado/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    const actuador = await Actuador.findOne({ nombre });
    if (!actuador) return res.status(404).json({ message: 'Actuador no encontrado' });

    res.status(200).json({ nombre: actuador.nombre, estado: actuador.estado ? 'encendido' : 'apagado' });
  } catch (error) {
    console.error('Error obteniendo el estado del actuador:', error);
    res.status(500).json({ error: 'Error obteniendo el estado del actuador', details: error });
  }
});

module.exports = router;

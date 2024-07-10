const express = require('express');
const router = express.Router();
const obtenerDatosEstacion  = require('../services/ambientWeatherService');

router.get('/datos-estacion', async (req, res) => {
  try {
    const datosEstacion = await obtenerDatosEstacion();
    res.status(200).json(datosEstacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de la estación meteorológica', details: error });
  }
});

module.exports = router;

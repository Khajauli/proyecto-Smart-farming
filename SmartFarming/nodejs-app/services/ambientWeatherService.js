
const AmbientWeatherApi = require('ambient-weather-api');

// Definicion de claves de API directamente en el código
const apiKey = 'tu_api_key';
const applicationKey = 'tu_application_key';

const api = new AmbientWeatherApi({
  apiKey: apiKey,
  applicationKey: applicationKey
});

async function obtenerDatosEstacion() {
  try {
    const data = await api.userDevices();
    return data;
  } catch (error) {
    console.error('Error al obtener datos de la estación meteorológica:', error);
    throw error;
  }
}

module.exports = {
  obtenerDatosEstacion
};

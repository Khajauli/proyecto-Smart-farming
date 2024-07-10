const mqtt = require('mqtt');
const Mensaje = require('../models/Mensaje');
const Sensor = require('../models/Sensor');
const Actuador = require('../models/Actuador');
const Regla = require('../models/Regla');

const urlBroker = 'mqtt://mqtt';
const Opciones = {
  clientId: 'mqtt_client',
  clean: true
};

let cliente;

const initialize = async () => {
  cliente = mqtt.connect(urlBroker, Opciones);

  cliente.on('connect', async () => {
    console.log('Conectado a broker MQTT');

    try {
      const sensores = await Sensor.find();
      const temas = sensores.map(sensor => sensor.nombre);

      cliente.subscribe(temas, (err) => {
        if (!err) {
          console.log(`Suscrito a los temas: ${temas.join(', ')}`);
        } else {
          console.error('Error al suscribirse a los temas:', err);
        }
      });
    } catch (error) {
      console.error('Error al obtener los sensores:', error);
    }
  });

  cliente.on('message', async (tema, mensaje) => {
    console.log('Mensaje recibido:', mensaje.toString(), 'en el tema:', tema);

    const nuevoMensaje = new Mensaje({
      tema: tema,
      mensaje: mensaje.toString(),
      fechaHora: new Date(),
      expiraEn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    });

    try {
      await nuevoMensaje.save();
      console.log('Mensaje guardado en MongoDB');

      const reglas = await Regla.find();

      for (const regla of reglas) {
        let condicionesCumplidas = true;

        for (const condicion of regla.condiciones) {
          if (condicion.sensor_nombre === tema) {
            const valorSensor = parseFloat(mensaje.toString());

            switch (condicion.operador) {
              case '>':
                if (!(valorSensor > condicion.valor)) {
                  condicionesCumplidas = false;
                }
                break;
              case '<':
                if (!(valorSensor < condicion.valor)) {
                  condicionesCumplidas = false;
                }
                break;
              default:
                condicionesCumplidas = false;
            }
          } else {
            condicionesCumplidas = false;
          }
        }

        if (condicionesCumplidas) {
          for (const accion of regla.acciones) {
            if (accion.actuador_nombre) {
              let mensajeActuador;

              if (accion.accion === 'OFF') {
                mensajeActuador = '0';
              } else if (accion.accion === 'ON') {
                mensajeActuador = '1';
              }

              if (mensajeActuador !== undefined) {
                cliente.publish(accion.actuador_nombre, mensajeActuador);
                console.log(`Publicado mensaje a ${accion.actuador_nombre}: ${mensajeActuador}`);

                const nuevoActuadorMensaje = new Mensaje({
                  tema: accion.actuador_nombre,
                  mensaje: mensajeActuador,
                  fechaHora: new Date(),
                  expiraEn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                });
                await nuevoActuadorMensaje.save();
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error manejando mensaje MQTT:', err);
    }
  });

  cliente.on('error', (err) => {
    console.error('MQTT error:', err);
  });
};

const suscribirseNuevoTema = (tema) => {
  if (cliente) {
    cliente.subscribe(tema, (err) => {
      if (!err) {
        console.log(`Suscrito al nuevo tema: ${tema}`);
      } else {
        console.error('Error suscribiéndose al nuevo tema:', err);
      }
    });
  }
};

const controlarSensor = async (nombreSensor, valor) => {
  const topic = `control/${nombreSensor}`;
  const message = valor.toString();

  try {
    const client = mqtt.connect('mqtt://localhost');
    await new Promise((resolve, reject) => {
      client.on('connect', () => {
        client.publish(topic, message, (err) => {
          client.end();
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
    console.log(`Mensaje MQTT enviado a ${topic}: ${message}`);
  } catch (error) {
    console.error('Error al enviar mensaje MQTT:', error);
  }
};

const controlarActuador = async (nombreActuador, valor) => {
  const topic = `control/${nombreActuador}`;
  const message = valor.toString();

  try {
    const client = mqtt.connect('mqtt://localhost');
    await new Promise((resolve, reject) => {
      client.on('connect', () => {
        client.publish(topic, message, (err) => {
          client.end();
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
    console.log(`Mensaje MQTT enviado a ${topic}: ${message}`);
  } catch (error) {
    console.error('Error al enviar mensaje MQTT:', error);
  }
};

const end = () => {
  if (cliente) {
    cliente.end();
  }
};

module.exports = {
  initialize,
  suscribirseNuevoTema,
  controlarActuador,
  controlarSensor,
  end
};

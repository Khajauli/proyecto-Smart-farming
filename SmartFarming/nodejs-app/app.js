const express = require('express');
const mongoose = require('mongoose');
const mqttClient = require('./services/mqttService');  // Importar el servicio MQTT
const mensajesRoutes = require('./routes/mensajes');
const sensoresRoutes = require('./routes/sensores');
const actuadoresRoutes = require('./routes/actuadores');
const reglasRoutes = require('./routes/reglas');
const estacionRouter = require('./routes/estacion');


const app = express();
const puerto = process.env.PORT || 3000;

// Conectar a MongoDB
const mongoURI = 'mongodb://mongodb:27017/baseParametros';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000 })
  .then(() => {
    console.log('Connected to MongoDB');
    mqttClient.initialize();  // Inicializar MQTT después de conectar a MongoDB
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Middleware para el parsing de JSON
app.use(express.json());


// Rutas
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/sensores', sensoresRoutes);
app.use('/api/actuadores', actuadoresRoutes);
app.use('/api/reglas', reglasRoutes);
app.use('/api/estacion', estacionRouter);

// Puerto en el que el servidor escucha
app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});

// Handle graceful shutdown
process.on('SIGINT', function () {
  mqttClient.end();
  mongoose.connection.close();
  console.log('Closed MQTT connection and MongoDB connection');
  process.exit();
});

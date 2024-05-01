const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mqtt_broker:1883');

client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.subscribe('your-topic', function (err) {
        if (err) {
            console.error('Subscription error:', err);
        } else {
            console.log('Subscribed to topic: your-topic');
        }
    });
});

client.on('message', function (topic, message) {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
    // Process incoming MQTT messages here
});

client.on('error', function (err) {
    console.error('MQTT client error:', err);
});
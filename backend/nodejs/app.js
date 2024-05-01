const mqtt = require ('mqtt');
const client = mqtt.connect('mqtt://mqtt_broker:1883');

//funcion para conectar y suscribirse al tema
client.on('connect', function(){
    console.log('Conectado al broker de MQTT ');

    //suscribirse a los temas de mqtt
    client.subscribe('your-topic');

});

//funcion para manejar los mensajes de MQTT
client.on('message', function(topic,message){
    console.log('Mensaje recibido:', message.toString());

});


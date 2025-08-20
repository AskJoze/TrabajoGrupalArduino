const SerialPort = require("serialport");
const WebSocket = require("ws");

const port = new SerialPort.SerialPort({
  path: "COM7",  // Cambia según tu Arduino (Linux: /dev/ttyUSB0)
  baudRate: 9600
});

const wss = new WebSocket.Server({ port: 8080 });

port.on("data", (data) => {
  const value = data.toString().trim();
  console.log("Dato recibido:", value);  // Agregado para debugging
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(value);
    }
  });
});

console.log("Servidor WebSocket en ws://localhost:8080");
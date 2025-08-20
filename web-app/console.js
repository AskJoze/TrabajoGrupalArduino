port.on("data", (data) => {
  const value = data.toString().trim();
  console.log("Dato recibido:", value);   // <-- mira aquí
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(value);
    }
  });
});

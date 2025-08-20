# Sistema de Monitoreo Cardíaco
# Integrantes: Jose Chasi, Alan Minda, Stiven Minda, Kevin Vaca

Este proyecto es una aplicación web para el monitoreo en tiempo real de señales ECG (electrocardiograma) provenientes de un dispositivo conectado vía puerto serial (como un Arduino o sensor similar). La aplicación muestra un gráfico en vivo de la señal ECG, calcula el pulso (BPM) y permite generar y subir reportes clínicos a Firebase, incluyendo datos del paciente y una captura del gráfico.

## Funcionalidades Principales

- **Lectura de datos en tiempo real**: Conecta a un dispositivo serial (por defecto en COM7 a 9600 baud) para recibir valores de ECG.
- **Visualización gráfica**: Usa Chart.js para mostrar la señal ECG en un gráfico lineal dinámico.
- **Detección de pulso**: Calcula el BPM basado en picos detectados en la señal (umbral ajustable).
- **Formulario de paciente**: Captura datos como nombre, apellidos, fecha de nacimiento, sexo, edad y cédula.
- **Generación de reportes**: Crea una imagen PNG del monitor (incluyendo datos del paciente y gráfico) usando html2canvas.
- **Almacenamiento en Firebase**: Sube la imagen a Firebase Storage y guarda metadatos (nombre, edad, pulso, etc.) en Firestore.
- **Historial de pulsaciones**: Muestra un listado de pulsos detectados (aunque en el código actual no se implementa explícitamente, se puede extender).
- **Interfaz responsive**: Diseño adaptable a dispositivos móviles con CSS moderno.

## Tecnologías Utilizadas

- **Backend**: Node.js con SerialPort para lectura serial y WebSocket (ws) para transmisión en tiempo real.
- **Frontend**: HTML5, CSS3, JavaScript vanilla, Chart.js para gráficos, html2canvas para capturas.
- **Base de datos y almacenamiento**: Firebase (Storage para imágenes, Firestore para metadatos).
- **Dependencias**: serialport, ws, y Firebase SDK (importado vía CDN en el frontend).

## Requisitos

- Node.js v20 o superior.
- Un dispositivo serial conectado (ej. Arduino enviando datos numéricos vía USB).
- Cuenta en Firebase con Storage y Firestore habilitados. Configura las credenciales en `firebase.js`.
- Navegador moderno (Chrome, Firefox, etc.).

## Instalación

1. Clona el repositorio:
   ```
   git clone https://github.com/AskJoze/ArduinoPulso.git
   cd sistema-monitoreo-cardiaco
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura el puerto serial en `server.js` (cambia `COM7` por tu puerto, ej. `/dev/ttyUSB0` en Linux/Mac).
   
4. Configura Firebase en `firebase.js` con tus credenciales (apiKey, authDomain, etc.).

## Uso

1. Inicia el servidor Node.js:
   ```
   npm start
   ```
   Esto inicia el WebSocket en `ws://localhost:8080` y comienza a leer del puerto serial.

2. Abre `index.html` en un navegador (o sirve el directorio con un servidor local como `http-server` para evitar problemas de CORS).

3. Completa el formulario con datos del paciente.

4. El gráfico se actualizará en tiempo real con datos del sensor. El pulso se calculará automáticamente.

5. Haz clic en "Generar y Subir Reporte Clínico" para capturar el monitor, generar una imagen PNG y subirla a Firebase.

   - El reporte se guarda en Firebase Storage como `Reporte_ECG_[cedula]_[timestamp].png`.
   - Los metadatos se almacenan en la colección `informes` de Firestore.

## Configuración Avanzada

- **Detección de picos**: En `app.js`, ajusta el umbral (`value > 500`) y el intervalo mínimo (`diff > 0.3`) para mejorar la precisión según tu sensor.
- **Puerto serial**: Si usas un puerto diferente, modifícalo en `server.js`.
- **Firebase**: Asegúrate de que las reglas de Storage y Firestore permitan escrituras (para desarrollo, usa reglas abiertas; en producción, añade autenticación).
- **Seguridad**: El WebSocket es local (`localhost:8080`); para producción, considera HTTPS y autenticación.

## Problemas Comunes

- **No se detectan datos**: Verifica que el dispositivo serial esté conectado y enviando datos numéricos (ej. valores entre 0-1023).
- **Error en Firebase**: Revisa la consola del navegador para errores de API Key o permisos.
- **Gráfico no se actualiza**: Asegúrate de que el WebSocket se conecte correctamente (ver consola).

## Contribuciones

¡Bienvenidas! Abre un issue o pull request para mejoras, como agregar autenticación, más métricas cardíacas o integración con ML para análisis.

## Licencia

MIT License. Ver [LICENSE](LICENSE) para detalles.

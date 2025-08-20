import { uploadReport } from './firebase.js';
 
const ctx = document.getElementById('ecgChart').getContext('2d');
let ecgData = [];
let lastPeak = Date.now();
let bpm = 0;
let firstBpm = null; 
 
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'ECG',
      data: [],
      borderColor: '#000000',
      borderWidth: 1.5,
      fill: false,
      pointRadius: 0,
    }]
  },
  options: {
    animation: false,
    scales: {
      x: { display: false },
      y: {
        min: 0,
        max: 1023,
        ticks: { color: '#333333' }
      }
    },
    plugins: {
      legend: { labels: { color: '#333333' } }
    }
  }
});
 
const socket = new WebSocket("ws://localhost:8080");
 
socket.onmessage = (event) => {
  let value = parseInt(event.data);
  console.log("Valor recibido:", event.data, " -> parseado:", value); 

  if (!isNaN(value)) {
    ecgData.push(value);
    if (ecgData.length > 200) ecgData.shift();
 
    chart.data.labels = Array.from({ length: ecgData.length }, (_, i) => i);
    chart.data.datasets[0].data = ecgData;
    chart.update();
 
    if (value > 300) {
      let now = Date.now();
      let diff = (now - lastPeak) / 1000;
      if (diff > 0.5) {
        let detectedBpm = Math.round(60 / diff);

        if (firstBpm === null) {
          firstBpm = detectedBpm;
          bpm = firstBpm;
        } else {
          bpm = detectedBpm;
        }

        document.getElementById("pulse").textContent =
          firstBpm !== null
            ? `Pulso inicial: ${firstBpm} BPM | Actual: ${bpm} BPM`
            : `Pulso: ${bpm} BPM`;

        const pulseList = document.getElementById("pulseList");
        const li = document.createElement("li");
        li.textContent = `${new Date().toLocaleTimeString()} → ${bpm} BPM`;
        pulseList.prepend(li);

        if (pulseList.children.length > 10) {
          pulseList.removeChild(pulseList.lastChild);
        }

        lastPeak = now;
      }
    }
  }
};
 
const saveBtn = document.getElementById("saveImage");
let uploadStatus = document.getElementById("uploadStatus");
if (!uploadStatus) {
  uploadStatus = document.createElement("div");
  uploadStatus.id = "uploadStatus";
  uploadStatus.style.marginTop = "15px";
  uploadStatus.style.fontSize = "1em";
  uploadStatus.style.color = "#333333";
  saveBtn.insertAdjacentElement("afterend", uploadStatus);
}
 
document.getElementById("saveImage").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const birthdate = document.getElementById("birthdate").value;
  const sex = document.getElementById("sex").value;
  const age = document.getElementById("age").value.trim();
  const id = document.getElementById("patientId").value.trim();
 
  if (!name || !apellidos || !birthdate || sex === '' || !age || !id || firstBpm === null) {
    uploadStatus.textContent = "Complete todos los campos y asegúrese de que se detecte un pulso.";
    uploadStatus.style.color = "#ff0000";
    return;
  }
 
  const fullName = `${name} ${apellidos}`;
  const currentDate = new Date().toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
 
  const patientData = document.getElementById("patientData");
  patientData.innerHTML = `
    <p><strong>PACIENTE:</strong> ${fullName}</p>
    <p><strong>ID:</strong> ${id}</p>
    <p><strong>EDAD:</strong> ${age} años</p>
    <p><strong>SEXO:</strong> ${sex}</p>
    <p><strong>FECHA NACIMIENTO:</strong> ${birthdate}</p>
    <p><strong>FECHA ESTUDIO:</strong> ${currentDate}</p>
    <p><strong>PULSO INICIAL:</strong> ${firstBpm} BPM</p>
    <p><strong>PULSO ACTUAL:</strong> ${bpm} BPM</p>
  `;
 
  const monitor = document.getElementById("monitor");
  uploadStatus.textContent = "Generando reporte clínico...";
  uploadStatus.style.color = "#333333";
 
  try {
    const canvas = await html2canvas(monitor, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    const imageBase64 = canvas.toDataURL("image/png");
    const filename = `Reporte_ECG_${id}_${Date.now()}.png`;
 
    uploadStatus.textContent = "Subiendo reporte clínico...";
    await uploadReport({ 
      base64: imageBase64, 
      filename, 
      name: fullName, 
      age, 
      id, 
      pulseInicial: firstBpm, 
      pulseActual: bpm, 
      birthdate, 
      sex 
    });
    uploadStatus.textContent = "Reporte clínico subido exitosamente.";
    uploadStatus.style.color = "#008000";
  } catch (error) {
    console.error("Error al generar o subir el reporte:", error);
    uploadStatus.textContent = `Error: ${error.message || error}`;
    uploadStatus.style.color = "#ff0000";
  } finally {
    patientData.innerHTML = '';
  }
});
  
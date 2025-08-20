import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getStorage, ref, uploadString } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// ⚠️ Reemplaza con tu config de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCV8H5xzIQolga91egzY-Q8ejSBGi6ynJQ",
  authDomain: "arduino-e8eaf.firebaseapp.com",
  projectId: "arduino-e8eaf",
  storageBucket: "arduino-e8eaf.firebasestorage.app",
  messagingSenderId: "728090759089",
  appId: "1:728090759089:web:042dba4cadb607dcb13790",
  measurementId: "G-05RRF0Y477"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export async function uploadReport({base64, filename, name, age, id, pulse, birthdate, sex}) {
  // Subir imagen al Storage
  const storageRef = ref(storage, "informes/" + filename);
  await uploadString(storageRef, base64, 'data_url');

  // Guardar datos en Firestore
  await addDoc(collection(db, "informes"), {
    nombre: name,
    edad: age,
    pacienteId: id,
    pulso: pulse,
    fechaNacimiento: birthdate,
    sexo: sex,
    imagen: filename,
    fecha: new Date().toISOString()
  });
}
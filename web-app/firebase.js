import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getStorage, ref, uploadString } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export async function uploadReport({base64, filename, name, age, id, pulse, birthdate, sex}) {
  const storageRef = ref(storage, "informes/" + filename);
  await uploadString(storageRef, base64, 'data_url');

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
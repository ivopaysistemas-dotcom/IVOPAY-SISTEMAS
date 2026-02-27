// firebase.ts
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBj2WzNpKagLjMDVTz7sxMWbXrXdTa-Hck",
  authDomain: "ivopaysistemas-4150a.firebaseapp.com",
  databaseURL: "https://ivopaysistemas-4150a-default-rtdb.firebaseio.com",
  projectId: "ivopaysistemas-4150a",
  storageBucket: "ivopaysistemas-4150a.appspot.com",
  messagingSenderId: "228125675762",
  appId: "1:228125675762:web:2b5037bdbf9b4dc99b806b",
  measurementId: "G-L1X92F8ZFG"
};

// Inicializa o Firebase e exporta os serviços
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Converte um documento do Firestore, incluindo seu ID e transformando Timestamps em Dates.
 * @param doc O documento do Firestore.
 * @returns Um objeto com o ID e os dados do documento com Datas JS.
 */
export function processFirestoreDoc(doc: any) {
  const data = doc.data();
  // Converte todos os campos Timestamp para objetos Date
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    }
  }
  return { id: doc.id, ...data };
}

export { app, auth, db };
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHdWkX6gn43Aru6tbm6kaT5pjaMFgYGuA",
  authDomain: "trumed-orders.firebaseapp.com",
  projectId: "trumed-orders",
  storageBucket: "trumed-orders.appspot.com",
  messagingSenderId: "20335170245",
  appId: "1:20335170245:web:7cd36bbd828eb0dd95d6ac"
};

// Inizializzazione pulita ed esclusiva di Firestore (zero Auth, zero timeout di rete estera)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Gestione sicura per evitare errori se l'HTML richiama il benvenuto o il logout
document.addEventListener("DOMContentLoaded", () => {
    const welcomeEl = document.getElementById('welcomeMessage');
    if (welcomeEl) {
        welcomeEl.textContent = "Offline Mode / Direct Access";
    }
});

window.logout = function() {
    // Reindirizza semplicemente alla home o pulisce l'interfaccia senza chiamare server auth esterni
    window.location.reload();
};
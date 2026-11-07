import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHdWkX6gn43Aru6tbm6kaT5pjaMFgYGuA",
  authDomain: "trumed-orders.firebaseapp.com",
  projectId: "trumed-orders",
  storageBucket: "trumed-orders.appspot.com",
  messagingSenderId: "20335170245",
  appId: "1:20335170245:web:7cd36bbd828eb0dd95d6ac"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const isLoginPage = window.location.pathname.includes('login.html');

// Gestione dello stato dell'utente senza loop
onAuthStateChanged(auth, (user) => {
    if (!user && !isLoginPage) {
        // Se non è loggato e siamo nella dashboard -> vai al login
        window.location.href = "login.html";
    } else if (user && isLoginPage) {
        // Rimosso il reindirizzamento automatico da login.html a index.html 
        // per evitare qualsiasi tipo di loop. Ci pensa login.js al click del bottone!
    } else if (user) {
        // Aggiorna il messaggio di benvenuto nella dashboard
        const welcomeEl = document.getElementById('welcomeMessage');
        if (welcomeEl) {
            const email = user.email || "User";
            welcomeEl.textContent = `Hello, ${email.split('@')[0]}`;
        }
    }
});

window.logout = function() {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Errore durante il logout:", error);
    });
};

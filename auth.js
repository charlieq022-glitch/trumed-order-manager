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

// Controlla se ci troviamo sulla pagina di login (gestendo anche eventuali percorsi puliti)
const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('/login');

onAuthStateChanged(auth, (user) => {
    if (!user && !isLoginPage) {
        // Se l'utente non è autenticato e non siamo nella pagina di login, reindirizza al login
        window.location.href = "login.html";
    } else if (user && isLoginPage) {
        // Se l'utente è già autenticato e tenta di aprire il login, rimandalo alla dashboard
        window.location.href = "index.html";
    } else if (user) {
        // Se l'utente è loggato nella dashboard, aggiorna l'interfaccia di benvenuto se presente
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

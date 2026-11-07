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

// Gestione stato utente e benvenuto
onAuthStateChanged(auth, (user) => {
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!user && !isLoginPage) {
        window.location.href = "login.html";
    } else if (user && isLoginPage) {
        window.location.href = "index.html";
    } else if (user) {
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

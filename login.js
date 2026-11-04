import { auth } from "./auth.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let isLoginMode = true;

window.toggleAuthMode = function() {
    isLoginMode = !isLoginMode;
    const btnSubmit = document.getElementById('btnSubmit');
    const toggleText = document.getElementById('toggleText');
    const btnToggle = document.getElementById('btnToggle');
    
    if (isLoginMode) {
        btnSubmit.textContent = "Accedi";
        toggleText.textContent = "Non hai un account?";
        btnToggle.textContent = "Registrati";
    } else {
        btnSubmit.textContent = "Registrati";
        toggleText.textContent = "Hai già un account?";
        btnToggle.textContent = "Accedi";
    }
}

window.handleAuth = async function(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const alertBox = document.getElementById('authAlert');

    alertBox.classList.add('hidden');

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        // Login riuscito: reindirizza alla dashboard principale (index.html)
        window.location.href = "index.html";
    } catch (error) {
        alertBox.textContent = "Errore: " + error.message;
        alertBox.className = "mb-4 p-3 text-xs rounded-xl border bg-red-50 border-red-200 text-red-600";
    }
}
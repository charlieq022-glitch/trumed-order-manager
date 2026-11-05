import { auth } from "./auth.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let isLoginMode = true;

window.toggleAuthMode = function() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById("formTitle");
    const btn = document.getElementById("submitBtn");
    const toggleText = document.getElementById("toggleText");
    const btnToggle = document.getElementById("btnToggle");

    if (isLoginMode) {
        title.textContent = "Accedi a Trumed";
        btn.textContent = "Accedi";
        toggleText.textContent = "Non hai un account?";
        btnToggle.textContent = "Registrati";
    } else {
        title.textContent = "Registrati su Trumed";
        btn.textContent = "Registrati";
        toggleText.textContent = "Hai già un account?";
        btnToggle.textContent = "Accedi";
    }
}

document.getElementById("authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "index.html"; // Reindirizza al gestionale dopo il login
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Registrazione avvenuta con successo!");
            window.location.href = "index.html";
        }
    } catch (error) {
        alert("Errore: " + error.message);
    }
});
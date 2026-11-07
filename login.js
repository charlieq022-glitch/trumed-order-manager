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
};

document.getElementById("authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.disabled = true;
    submitBtn.textContent = "Caricamento...";

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
            // Reindirizzamento esplicito alla dashboard
            window.location.assign("./index.html");
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Registrazione avvenuta con successo!");
            window.location.assign("./index.html");
        }
    } catch (error) {
        alert("Errore durante l'accesso: " + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = isLoginMode ? "Accedi" : "Registrati";
    }
});

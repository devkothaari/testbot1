import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_2EFOt1ekM2QnDz_FMhsrINhjMShb77I",
  authDomain: "colab-withus.firebaseapp.com",
  projectId: "colab-withus",
  storageBucket: "colab-withus.firebasestorage.app",
  messagingSenderId: "937158539992",
  appId: "1:937158539992:web:39228a71cfb7a6ec7335ad",
  measurementId: "G-361PMCTX7N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "chat.html";
    })
    .catch((error) => {
      alert("Login Error: " + error.message);
    });
});

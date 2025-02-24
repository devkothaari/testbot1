// Import Firebase modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";

// Your Firebase configuration details
const firebaseConfig = {
  apiKey: "AIzaSyA_2EFOt1ekM2QnDz_FMhsrINhjMShb77I",
  authDomain: "colab-withus.firebaseapp.com",
  projectId: "colab-withus",
  storageBucket: "colab-withus.firebasestorage.app",
  messagingSenderId: "937158539992",
  appId: "1:937158539992:web:39228a71cfb7a6ec7335ad",
  measurementId: "G-361PMCTX7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Handle Registration Form Submission
document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Registration successful!");
      // Redirect to the login page after successful registration
      window.location.href = "login.html";
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        alert("User already exists. Please login.");
      } else {
        alert("Registration Error: " + error.message);
      }
    });
});

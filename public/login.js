// Import Firebase modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
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

// Handle Login Form Submission
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "chat.html"; // Redirect to chat page upon login success
    })
    .catch((error) => {
      alert("Login Error: " + error.message);
    });
});

// Handle GET Request Button for Cloud Function (if needed)
document.getElementById("get-request-btn").addEventListener("click", async () => {
  try {
    // Replace with your actual Cloud Function URL after deployment
    const functionURL = "https://us-central1-your-project-id.cloudfunctions.net/getData";
    const response = await fetch(functionURL);
    const data = await response.json();
    document.getElementById("response").innerText = data.message;
  } catch (error) {
    console.error("Error making GET request:", error);
    document.getElementById("response").innerText = "Error fetching data.";
  }
});

// Handle Create New User Form Submission
document.getElementById('create-user-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('new-user-email').value;
  const password = document.getElementById('new-user-password').value;
  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      document.getElementById('user-id-display').innerText = "User created successfully. UID: " + uid;
    })
    .catch((error) => {
      alert("Error creating user: " + error.message);
    });
});

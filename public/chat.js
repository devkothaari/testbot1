// chat.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
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

// Verify user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('user-info').innerText = "Logged in as: " + user.email;
  } else {
    // Redirect to login if not authenticated
    window.location.href = "login.html";
  }
});

// Connect to the chat server via Socket.IO
const socket = io('http://localhost:3001'); // Adjust URL if needed

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

// Send message on button click or Enter key
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  } else {
    // Emit typing event to the server
    socket.emit('typing', "User is typing...");
  }
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== '') {
    // Emit the chat message event to the server
    socket.emit('chat message', message);
    messageInput.value = '';
    typingIndicator.innerText = '';
  }
}

// Listen for incoming chat messages
socket.on('chat message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  // Display sender's id and the (possibly transformed) message
  messageElement.innerText = data.sender + ": " + data.message;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Listen for typing indicator events
socket.on('typing', (data) => {
  typingIndicator.innerText = data.message;
  setTimeout(() => {
    typingIndicator.innerText = '';
  }, 2000);
});

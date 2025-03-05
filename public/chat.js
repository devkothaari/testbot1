// chat.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Check for authenticated user
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("user-info").innerText = "Logged in as: " + user.email;
    startChat();
  } else {
    window.location.href = "login.html";
  }
});

function startChat() {
  const messagesDiv = document.getElementById("messages");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const typingIndicator = document.getElementById("typing-indicator");

  // Send message on button click or when Enter is pressed
  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  async function sendMessage() {
    const text = messageInput.value.trim();
    if (text !== "") {
      try {
        // Call the HTTPS function to transform the message.
        const response = await fetch(
          "https://transformmessagehttp-fhlpw54wna-uc.a.run.app",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
          }
        );
        if (!response.ok) {
          throw new Error("Transformation function error: " + response.statusText);
        }
        const result = await response.json();
        const finalMessage = result.transformed;
        // Write the transformed message to Firestore using the sender's email
        await addDoc(collection(db, "messages"), {
          text: finalMessage,
          sender: auth.currentUser.email,
          timestamp: new Date()
        });
        messageInput.value = "";
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }

  // Real-time listener for messages ordered by timestamp
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, (querySnapshot) => {
    messagesDiv.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      let timeStr = "";
      if (data.timestamp) {
        const ts = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
        timeStr = ` (${ts.toLocaleTimeString()})`;
      }
      messageElement.innerText = `${data.sender}${timeStr}: ${data.text}`;
      messagesDiv.appendChild(messageElement);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

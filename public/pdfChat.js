// pdfChat.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc 
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

let currentPdfDocId = null; // Will store the selected PDF's document ID

// Check for authenticated user; if not, redirect to login.html
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    console.log("User authenticated:", user.email);
    populatePdfSelector();
    setupChatListener();
  }
});

// Populate the PDF dropdown by reading the "pdfDocuments" collection
function populatePdfSelector() {
  const pdfSelector = document.getElementById("pdf-selector");
  onSnapshot(collection(db, "pdfDocuments"), (snapshot) => {
    pdfSelector.innerHTML = `<option value="">-- Choose a PDF --</option>`;
    snapshot.forEach((doc) => {
      console.log("Found PDF Document:", doc.id, doc.data());
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.text = data.fileName || doc.id;
      pdfSelector.appendChild(option);
    });
  });
}

// When a user selects a PDF, show the chat section and set currentPdfDocId
document.getElementById("pdf-selector").addEventListener("change", (e) => {
  currentPdfDocId = e.target.value;
  console.log("Selected PDF docId:", currentPdfDocId);
  const chatSection = document.getElementById("chat-section");
  chatSection.style.display = currentPdfDocId ? "block" : "none";
});

// Set up real-time chat message listener for PDF chat messages
function setupChatListener() {
  const chatMessagesDiv = document.getElementById("chat-messages");
  const q = query(collection(db, "pdfChatMessages"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    chatMessagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.pdfDocId === currentPdfDocId) {
        const msgElem = document.createElement("div");
        msgElem.classList.add("message");
        const ts = data.timestamp && data.timestamp.toDate 
          ? data.timestamp.toDate() 
          : new Date(data.timestamp);
        const timeStr = ts.toLocaleTimeString();
        msgElem.innerText = `${data.sender} (${timeStr}):\nQ: ${data.question}\nA: ${data.answer}`;
        chatMessagesDiv.appendChild(msgElem);
      }
    });
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  });
}

// Handle chat question submission
const sendChatButton = document.getElementById("send-chat");
const chatInput = document.getElementById("chat-input");
sendChatButton.addEventListener("click", sendChatMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendChatMessage();
  }
});

async function sendChatMessage() {
  const question = chatInput.value.trim();
  console.log("Send button clicked. Question:", question);
  if (!question || !currentPdfDocId) {
    console.log("No question entered or no PDF selected. currentPdfDocId:", currentPdfDocId);
    return;
  }
  try {
    // Call the Cloud Function to answer the PDF question.
    // Make sure the URL is correct and the Cloud Function is deployed.
    const response = await fetch(
      "https://us-central1-colab-withus.cloudfunctions.net/answerPdfQuestion",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfDocId: currentPdfDocId, question: question })
      }
    );
    if (!response.ok) {
      throw new Error("Error from answerPdfQuestion: " + response.statusText);
    }
    const result = await response.json();
    const answer = result.answer || "No answer available.";
    console.log("Received answer:", answer);
    // Store the Q&A in Firestore under the "pdfChatMessages" collection
    await addDoc(collection(db, "pdfChatMessages"), {
      pdfDocId: currentPdfDocId,
      question: question,
      answer: answer,
      sender: auth.currentUser.email,
      timestamp: new Date()
    });
    chatInput.value = "";
  } catch (error) {
    console.error("Error sending chat message:", error);
  }
}

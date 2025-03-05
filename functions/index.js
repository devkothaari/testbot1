const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
// const pdfParse = require("pdf-parse");

admin.initializeApp();

exports.getData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(403).send("Forbidden! Only GET requests are allowed.");
    }
    res.json({
      message: "Hello, this is a GET response from Firebase!",
    });
  });
});

exports.postData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(403).send("Forbidden! Only POST requests are allowed.");
    }
    const data = req.body;
    functions.logger.info("Received POST data:", data);
    res.json({
      message: "POST request successful!",
      received: data,
    });
  });
});

exports.transformMessageHTTP = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(403).send("Forbidden! Only POST requests are allowed.");
    }
    const data = req.body;
    if (!data || !data.text) {
      return res.status(400).send("Bad Request: Missing 'text' field.");
    }
    const originalText = data.text;
    const transformedText = originalText.replace(/whats\s?up/gi, "wassup");
    res.json({
      original: originalText,
      transformed: transformedText,
    });
  });
});

exports.extractPdfText = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(403).send("Forbidden! Only POST requests are allowed.");
  }
  try {
    // Destructure the fileUrl and docId from the request body
    const {fileUrl, docId} = req.body;
    if (!fileUrl || !docId) {
      return res.status(400).send("Missing fileUrl or docId");
    }
    // Extract fileName from fileUrl (assumes the file name is after the last '/')
    const fileName = fileUrl.split("/").pop();// Simulate text extraction (replace this with your actual PDF parsing logic)
    const extractedText = "Extracted text from PDF...";
    // Store metadata in Firestore under pdfDocuments/{docId}
    await admin.firestore().collection("pdfDocuments").doc(docId).set({
      fileName: fileName,
      fileUrl: fileUrl,
      text: extractedText,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ssuccess: true, fileName, text: extractedText});
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    res.status(500).send("Error extracting PDF text");
  }
});


exports.answerPdfQuestion = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(403).send("Forbidden! Only POST requests are allowed.");
  }
  const {pdfDocId, question} = req.body;
  if (!pdfDocId || !question) {
    return res.status(400).send("Missing pdfDocId or question");
  }
  try {
    // Retrieve the PDF text from Firestore
    const docSnap = await admin.firestore().collection("pdfDocuments").doc(pdfDocId).get();
    if (!docSnap.exists) {
      return res.status(404).send("PDF document not found");
    }
    // const pdfData = docSnap.data();
    // const pdfText = pdfData.text;
    // // For now, simulate an answer based on the PDF content and question.
    const answer = "Simulated answer based on PDF content.";
    res.json({answer});
  } catch (error) {
    console.error("Error answering question:", error);
    res.status(500).send("Error processing question");
  }
});

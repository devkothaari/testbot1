const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");

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


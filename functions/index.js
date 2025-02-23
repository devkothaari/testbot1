const functions = require("firebase-functions");
const cors = require("cors")({origin: true});

// GET endpoint (for reference)
exports.getData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(403).send("Forbidden! Only GET requests are allowed.");
    }
    res.json({message: "Hello, this is a GET response from Firebase!"});
  });
});

// POST endpoint
exports.postData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // Ensure we only accept POST requests
    if (req.method !== "POST") {
      return res.status(403).send("Forbidden! Only POST requests are allowed.");
    }

    // Read data from the request body
    const data = req.body;

    // Log the received data (visible in the Firebase console logs)
    functions.logger.info("Received POST data:", data);

    // Send a response back to the client
    res.json({
      message: "POST request successful!",
      received: data,
    });
  });
});

const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey =
  "BNQ6B4tn2jL4vSQILSrRJoMSn8XITG3Jyl7D-mWSqe1HZgY9HwilFJV2aLa2cKQg8UrpNlTJCozUtk57HIgzH3A";
const privateVapidKey = "lcjLMiOQSo6bXlVvB8A8d-79bPqQkzN840FZ1F1wc3Q";

webpush.setVapidDetails(
  "ilias.abai.alser@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

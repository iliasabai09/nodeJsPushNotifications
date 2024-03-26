const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешить запросы с любых источников
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Разрешить указанные методы запросов
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Разрешить указанные заголовки
  if (req.method === 'OPTIONS') {
    res.sendStatus(200); // Для предварительных запросов (OPTIONS) возвращаем успешный статус без тела ответа
  } else {
    next(); // Передаем управление следующему middleware в цепочке
  }
});
// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey =
  "BNQ6B4tn2jL4vSQILSrRJoMSn8XITG3Jyl7D-mWSqe1HZgY9HwilFJV2aLa2cKQg8UrpNlTJCozUtk57HIgzH3A";
const privateVapidKey = "lcjLMiOQSo6bXlVvB8A8d-79bPqQkzN840FZ1F1wc3Q";

webpush.setVapidDetails(
    "mailto:ilias.abai.alser@gmail.com",
    publicVapidKey,
    privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  const pushConfig = req.body;
  axios.put(`https://phrases-ae88c-default-rtdb.firebaseio.com/users/${pushConfig.keys.auth}.json`, pushConfig)
  res.status(201).json({});
});


app.post("/push", async (req, res) => {
  try {
    const subscription = req.body.pushConfig;
    const pushParams = req.body.pushParams;
    res.status(201).json({});
    const payload = JSON.stringify(pushParams);
    await webpush
        .sendNotification(subscription, payload)
  } catch (e) {
    res.status(503).json({e});
    res.send('error')
  }
});

app.post("/pushMany", async (req, res) => {
  try {
    const body = req.body;
    res.status(201).json({});
    const payload = JSON.stringify(body);
    const resp = await axios.get('https://phrases-ae88c-default-rtdb.firebaseio.com/users.json');
    for (const respKey in resp.data) {
      try {
        await webpush
            .sendNotification({...resp.data[respKey], expirationTime: null}, payload)
      } catch (e) {
        console.log('eeee', e);
      }

    }
  } catch (e) {
    res.status(503).json({e});
    res.send('error')
  }
});

const port = 3333;

app.listen(port, () => console.log(`Server started on port ${port}`));

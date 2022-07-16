const Datastore = require("nedb");
const express = require("express");
const router = express.Router();
const database = new Datastore("userdatabase.db");
database.loadDatabase();

router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.get("/users", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      console.log("[SERVER] an error has occurred [User Database]");
      response.end();
      return;
    }
    response.json(data);
  });
});

router.post("/users", (request, response) => {
  const data = request.body;
  console.log(
    "[SERVER] a request has been received via POST for UserDatabase [INSERT Commission]"
  );
  database.insert(data);
  response.json(data);
});

// Export

module.exports = router;
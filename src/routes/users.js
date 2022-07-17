const { response } = require("express");
const express = require("express");
const router = express.Router();
const Datastore = require('nedb');
const database = new Datastore("userdatabase.db");
database.loadDatabase();
router.use((req, res, next) => {
	console.log("Time: ", Date.now());
	next();
});



router.post("/", (request, response) => {
	const data = request.body;
	console.log(
	  "[SERVER] a request has been received via POST for UserDatabase [INSERT Commission]"
	);
	database.insert(data);
	response.json(data);
  });


// Export

module.exports = router;

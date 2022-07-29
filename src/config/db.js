const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(
			process.env.URI,
			() => {
				console.log("connected");
			},
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
	} catch (err) {
		console.error("Database connection error: ", err);
	}
};

module.exports = connectDB;

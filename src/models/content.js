const mongoose  = require("mongoose");

const contentSchema = new mongoose.Schema({
    text: String,
    from: Number,
    round: Number,
    game: String
});

module.exports = mongoose.model("Text", contentSchema);
const mongoose  = require("mongoose");

const contentSchema = new mongoose.Schema({
    text: String,
    from: Number,
    round: Number,
    game: String
}, {collection: 'textcontent'});

module.exports = mongoose.model("Text", contentSchema);
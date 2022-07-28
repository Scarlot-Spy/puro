const mongoose = require("mongoose");

const Closschemsa = new mongoose.Schema({
    channelID: String,
    data: String
})

module.exports = mongoose.model("transcloses", Closschemsa);
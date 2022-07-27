const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildID: String,
    array: [Object]
})

module.exports = mongoose.model("guild", guildSchema);
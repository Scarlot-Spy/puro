// TICKET - SETUP \\
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    guildID: String,
    Buttons: [String], // ['Support', 'Password', 'Report'] - Button titles
    Description: String,
})

module.exports = mongoose.model("ticketsetup", ticketSchema);
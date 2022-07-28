const express = require('express');
const app = express();
module.exports = app
const tickettans = require('../models/close');

module.exports = {
    app,
    ticket: async () => {
        const ticket = await tickettans.find({})
        if (ticket) {
            ticket.forEach(async (t) => {
                app.get('/ticket/'+t.channelID, (req, res) => {
                    res.send(t.data)
                })
            })
        } else return;
    }
}

app.get('/', (req, res) => {
    res.send("Hi!")
})


app.listen(3000, () => {
    console.log("Started site!")
})
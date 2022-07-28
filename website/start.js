const express = require('express');
const app = express();
const tickettans = require('../models/close');
const reactViews = require('express-react-views');
var DiscordStrategy = require('passport-discord').Strategy;
global.user = false

module.exports = {
    app,
    ticket: async () => {
        const ticket = await tickettans.find({})
        if (ticket) {
            ticket.forEach(async (t) => {
                app.get('/ticket/' + t.channelID, (req, res) => {
                    res.send(t.data)
                })
            })
        } else return;
    }
}

app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());
app.set('views', __dirname + '/public')

app.get('/', (req, res) => {
    res.render('home', {
        title: "Home"
    })
})

app.get('/css/home.css', (req, res) => {
    res.sendFile(__dirname + '/public/Data/style.css')
})

/* 
app.use((req, res) => {
    res.send(`<center><h1>404</h1><br><h2>Couldn't find the webpage <code style="color: red">${req.url}</code>!<br>Try a different url!</h2></center>`)
})
*/

app.listen(3000, () => {
    console.log("Started site!")
})
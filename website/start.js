const express = require('express');
const app = express();
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

app.set('view engine', 'ejs')
app.set('views', __dirname+'/public')

app.get('/', (req, res) => {
    res.render('home', {
        title: "Home"
    })
})


/* 
app.use((req, res) => {
    res.send(`<center><h1>404</h1><br><h2>Couldn't find the webpage <code style="color: red">${req.url}</code>!<br>Try a different url!</h2></center>`)
})
*/

app.listen(3000, () => {
    console.log("Started site!")
})
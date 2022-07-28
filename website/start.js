const express = require('express');
const app = express();
const tickettans = require('../models/close');
const reactViews = require('express-react-views');
var DiscordStrategy = require('passport-discord').Strategy;
var scopes = ['identify', 'guilds'];
global.user = false
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require('passport');


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

app.use(
    session({
        store: new MemoryStore({ checkPeriod: 86400000 }),
        secret:
            "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
        resave: false,
        saveUninitialized: false,
    }),
);

app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());
app.set('views', __dirname + '/public')


passport.use(new DiscordStrategy({
    clientID: global.config.CLIENTID,
    clientSecret: global.config.clientSecret,
    callbackURL: global.config.domain + global.config.callbackURL,
    scope: scopes
},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(() => done(null, profile));
    }));

app.get('/login', passport.authenticate('discord'));
app.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    res.redirect('/')
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    global.user = req.isAuthenticated() ? req.user : null
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
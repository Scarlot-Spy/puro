const axios = require('axios')

module.exports = {
    TOKEN: 'Bot Token',
    PREFIX: 'Bot Prefix',
    CLIENTID: 'Bot Id',
    Mongodb: 'Mongodb URL',
    domain: "Website domain",
    clientSecret: "Client Secret",
    callbackURL: "/callback",
    loginBotID: "Login Bot ID",
    botInfo: {
        Name: "Bot Name",
        Id: "Bot Id",
        Prefix: "Bot Prefix",
        Description: "Bot Description",
    },
    STATUSES: [
        `Made with ❤️`,
        `Watching %u users`,
    ],
    stats: (guilds) => {
        axios({
            method: 'post',
            url: 'https://radarbotdirectory.xyz/api/bot/BOTID/stats',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': "API KEY",
            },
            data: {
                guilds: guilds,
            },
        }).then(function (res) {
            //console.log(res)
        }).catch(function (err) {
            console.log(err)
        });
    }
}
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const Discord = require('discord.js');
const mongo = require('mongoose');
const client = new Discord.Client({ intents: 32767, partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"] });
const fs = require('node:fs'), path = require('node:path'), util = require('node:util');
const guildModel = require('./models/guild')
const ticketModel = require('./models/ticket')
const ticket = require('./models/tickets');
global.config = require('./configs/bots')
global.app = require('./website/start.js').app
require('./website/start.js').ticket()
global.close = require('./models/close')

const Shuffle = (statuses, time, client) => {
    client.user.setActivity(global.config.STATUSES[Math.floor(Math.random() * global.config.STATUSES.length)].replace('%s', client.user.username).replace('%g', client.guilds.cache.size).replace('%u', client.users.cache.size), { type: 'PLAYING' })
    setInterval(() => {
        client.user.setActivity(statuses[Math.floor(Math.random() * statuses.length)].replace('%s', client.user.username).replace('%g', client.guilds.cache.size).replace('%u', client.users.cache.size), { type: 'PLAYING' })
    }, time);
}
const prefix = global.config.PREFIX


client.commands = new Discord.Collection()
client.messageCommands = new Discord.Collection()

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.name, command)
}

const msgCommandsPath = path.join(__dirname, 'msgCommands');
const msgCommandsFiles = fs.readdirSync(msgCommandsPath).filter(file => file.endsWith('.js'));

for (const fole of msgCommandsFiles) {
    const path2 = path.join(msgCommandsPath, fole);
    const command = require(path2);

    client.messageCommands.set(command.name, command)
}

client.on('ready', function ready() {
    console.log(`Bot has started!`)
    console.log(`Logged into ${client.user.tag}!`)
    global.config.stats(client.guilds.cache.size)
    mongo.connect(global.config.Mongodb)
    Shuffle(global.config.STATUSES, 60000, client)
});

client.on('guildCreate', () => {
    const rest = new REST({ version: '10' }).setToken(global.config.TOKEN);

    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(global.config.CLIENTID),
                { body: client.commands.map(x => x) },
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
    global.config.stats(client.guilds.cache.size)
})

client.on('guildDelete', () => {
    global.config.stats(client.guilds.cache.size)
})

client.on('messageCreate', async (message) => {
    //if (!message.guild.id === '995288970223165491') return message.reply(`❌ | Sorry but I'm currently being tested and cannot be used inside this guild!`)

    if (message.author.bot) return;

    if (message.content == `<@983415009021399090>` || message.content == `<@!983415009021399090>`) {
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return message.reply(`❌ | I do not have the right privileges **[\`EMBED_LINKS\`]** to do this command!`)
        const embed = new Discord.MessageEmbed()
            .setTitle(`Hello, ${message.author.username}!`)
            .setColor("BLURPLE")
            .addField("About me", `I'm a multipurposed discord bot, \nI was developed by [Scarlot (Spy)#6164](https://discord.com/users/902313445121212536)!`)
            .addField("Social Media", `You can find my social media stuff here! \nYoutube: [Youtube Link](https://www.youtube.com/channel/UCQI13LszOd04qZBa-L8ADuA)\nDiscord: [Discord server](https://discord.gg/3YXRMFzxdt)`)
            .addField("Voting", `You can vote for me on these sites!\n[radarbotdirectory.xyz](https://radarbotdirectory.xyz/bot/983415009021399090/vote)`)
            .setFooter({ text: `Thanks for adding me!` })
        message.reply({ embeds: [embed] })
    }


    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    const cmd = client.messageCommands.get(command);

    if (!cmd && message.content.startsWith(prefix)) return;

    try {
        if (cmd && message.content.startsWith(prefix)) {
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return message.reply(`❌ | I do not have the right privileges **[\`EMBED_LINKS\`]** to do this command!`)

            if (cmd.name === 'ticket-setup') {
                if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) return message.reply(`❌ | I do not have the right privileges **[\`MANAGE_CHANNELS\`]** to do this command!`);
            }

            cmd.execute(message, args);
        }
    } catch (err) {
        console.log(err)
    }

    const guilddat = await guildModel.findOne({ guildID: message.guild.id });

    if (!guilddat) return;
    else if (guilddat) {
        for (let i = 0; i < guilddat.array.length; i++) {
            if (message.content.includes(guilddat.array[i].word.toUpperCase()) && !cmd || message.content.includes(guilddat.array[i].word.toLowerCase()) && !cmd) {
                message.reply(guilddat.array[i].reply)
            }
        }
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
    if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return interaction.reply(`❌ | I do not have the right privileges **[\`EMBED_LINKS\`]** to do this command!`)
    if (interaction.isCommand()) {
        if (interaction.user.bot) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
            if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) return interaction.reply(`❌ | I do not have the right privileges **[\`EMBED_LINKS\`]** to do this command!`)

            if (command.name === 'ticket-setup') {
                if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply(`❌ | I do not have the right privileges **[\`MANAGE_CHANNELS\`]** to do this command!`);
            }

            command.execute(interaction)
        } catch (e) { console.log(e) }
    } else if (interaction.isButton()) {
        if (interaction.user.bot) return;
        const ticketModule = await ticketModel.findOne({ guildID: interaction.guild.id });

        if (!ticketModule) return;
        else if (ticketModule) {
            for (var i = 0; i < ticketModule.Buttons.length; i++) {
                if (interaction.customId === `${ticketModule.Buttons[i]}-${interaction.guild.id}`) {
                    const channel = `${ticketModule.Buttons[i]}-${interaction.user.id}-${interaction.user.username}`;
                    const ticketUser = await ticket.findOne({ guildID: interaction.guild.id, authorID: interaction.user.id, reason: ticketModule.Buttons[i] });
                    if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply(`❌ | I do not have the right privileges **[\`MANAGE_CHANNELS\`]** to do this command!`);
                    if (!ticketUser) {
                        interaction.guild.channels.create(channel, {
                            type: 'text',
                            permissionOverwrites: [{
                                id: interaction.guild.id,
                                deny: ['VIEW_CHANNEL'],
                            }, {
                                id: interaction.user.id,
                                allow: ['VIEW_CHANNEL'],
                            }, {
                                id: interaction.client.user.id,
                                allow: ['VIEW_CHANNEL'],
                            }]
                        }).then(async (channel) => {
                            new ticket({
                                guildID: interaction.guild.id,
                                authorID: interaction.user.id,
                                reason: interaction.customId.toString().replace(`-${interaction.guild.id}`, ''),
                                channelID: channel.id
                            }).save()
                            channel.setTopic(`**This is used to close the ticket!** \n\n **Close ID: ${channel.id}**`)
                            const embed = new Discord.MessageEmbed()
                                .setTitle(`New ticket!`)
                                .setDescription(`Wait for a staff member to start helping you! \n**→** Opened by ${interaction.user.tag} \n\n **→** *Thanks for using \`Puro's ticket system\`!*`)
                                .addField(`Close ID`, channel.id)
                            channel.send({ content: `@here`, embeds: [embed] })

                            interaction.reply({ content: `Opened ticket for ${interaction.customId.toString().replace(`-${interaction.guild.id}`, '')} \n This channel: <#${channel.id}>`, ephemeral: true })
                        })
                    } else return interaction.reply({ content: `You already have a ticket open for \`${ticketModule.Buttons[i]}\`!` })
                }
            }
        }
    }
})

client.login(
    global.config.TOKEN
)

const rest = new REST({ version: '10' }).setToken(global.config.TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(global.config.CLIENTID),
            { body: client.commands.map(x => x) },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
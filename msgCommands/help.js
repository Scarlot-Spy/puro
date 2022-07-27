const { Permissions, PermissionFlagsBits, MessageActionRow, MessageButton } = require('discord.js'), Discord = require('discord.js')
const ticketModel = require('../models/ticket')

module.exports = {
    usage: `!NONE!`,
    category: `Generic`,
    name: "help",
    description: "Shows all available commands!",
    dm_permission: false,
    async execute(message, args) {
        const { messageCommands } = message.client;
        const generic = [], genT = []
        const tickets = [], ticT = []
        const AR = [], ART = []

        messageCommands.forEach(command => {
            if (command.category == 'Generic') {
                generic.push({
                    desc: `\`${command.name}\` - ${command.description}\n Usage: ${command.usage}`
                })
            } if (command.category == 'Tickets') {
                tickets.push({
                    desc: `\`${command.name}\` - ${command.description}\n Usage: ${command.usage}`
                })
            } if (command.category == 'Automatic reply') {
                AR.push({
                    desc: `\`${command.name}\` - ${command.description}\n Usage: ${command.usage}`
                })
            }
        })

        const embeed = new Discord.MessageEmbed()
            .setTitle(`Help`)
            .setColor('RANDOM')
            .setFooter({ text: 'All Message commands!' })

        //console.log(CMD)

        generic.forEach(command => {
            genT.push(command.desc)
        })

        tickets.forEach(ticket => {
            ticT.push(ticket.desc)
        })

        AR.forEach(ar => {
            ART.push(ar.desc)
        })
        embeed.setDescription(`**Generic**\n ${genT.join(", \n")} \n\n **Tickets**\n ${ticT.join(", \n")} \n\n **Automatic Reply** \n ${ART.join(", \n")}`)

        message.reply({ embeds: [embeed] })
    }
}
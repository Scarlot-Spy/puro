const { Permissions, PermissionFlagsBits, MessageActionRow, MessageButton } = require('discord.js'), Discord = require('discord.js')
const ticketModel = require('../models/ticket')

module.exports = {
    category: `Generic`,
    name: "help",
    description: "Shows all available commands!",
    dm_permission: false,
    async execute(interaction) {
        const {commands} = interaction.client;
        const generic = [], genT = []
        const tickets = [], ticT = []
        const AR = [], ART = []

        commands.forEach(command => {  
            if (command.category == 'Generic') {
                generic.push({
                    desc: `\`${command.name}\` - ${command.description}`
                })
            } if (command.category == 'Tickets') {
                tickets.push({
                    desc: `\`${command.name}\` - ${command.description}`
                })
            } if (command.category == 'Automatic reply') {
                AR.push({
                    desc: `\`${command.name}\` - ${command.description}`
                })
            }
        })

        const embeed = new Discord.MessageEmbed()
        .setTitle(`Help`)
        .setColor('RANDOM')
        .setFooter({ text: 'All Slash commands!' })

        //console.log(CMD)

        generic.forEach(command =>{
            genT.push(command.desc)
        })

        tickets.forEach(ticket =>{
            ticT.push(ticket.desc)
        })

        AR.forEach(ar => {
            ART.push(ar.desc)
        })
        embeed.setDescription(`**Generic**\n ${genT.join(", \n")} \n\n **Tickets**\n ${ticT.join(", \n")} \n\n **Automatic Reply** \n ${ART.join(", \n")}`)

        interaction.reply({ embeds: [embeed] })
    }
}
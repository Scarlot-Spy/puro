const { Permissions, PermissionFlagsBits, MessageActionRow, MessageButton } = require('discord.js'), Discord = require('discord.js')
const ticketModel = require('../models/ticket')

module.exports = {
    usage: `<First button name> <Second button name> <Third button name> <description>`,
    category: `Tickets`,
    name: "ticket-setup",
    description: "Enable tickets for this guild.",
    dm_permission: false,
    default_member_permissions: Permissions.FLAGS.MANAGE_GUILD.toString().replace('n', ''),
    options: [
        {
            type: 3,
            name: 'button1',
            description: "Set the first button's name.",
            required: true,
        },
        {
            type: 3,
            name: 'button2',
            description: "Set the second button's name.",
            required: true,
        },
        {
            type: 3,
            name: 'button3',
            description: "Set the third button's name.",
            required: true,
        },
        {
            type: 3,
            name: 'description',
            description: "Set the embeds description.",
            required: true,
        },
    ],
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply(`❌ | You don't have the right privileges to use this command!`)

        if (!args || args.length === 0) return message.reply(`You cannot setup a ticket menu without arguments. \n Please provide some arguments!`)

        const button1 = args[0]
        const button2 = args[1]
        const button3 = args[2];
        const description = args.slice(3).join(" ");

        const setup = await ticketModel.findOne({ guildID: message.guild.id });

        if (!setup) {
            new ticketModel({
                guildID: message.guild.id,
                Buttons: [button1, button2, button3],
                Description: description
            }).save();

            message.reply({ content: `Successfully saved tickets!` }).then(ms => {
                setTimeout(() => {
                    ms.delete()
                }, 1500)
            })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel(button1)
                        .setCustomId(button1 + '-' + message.guild.id)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setLabel(button2)
                        .setCustomId(button2 + '-' + message.guild.id)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setLabel(button3)
                        .setCustomId(button3 + '-' + message.guild.id)
                        .setStyle('PRIMARY')
                )
            const embed = new Discord.MessageEmbed()
                .setTitle('Tickets - ' + message.guild.name)
                .setDescription(description)
                .setColor("RANDOM")
                .setFooter({ text: 'Tickets • Puro' })

            message.channel.send({ embeds: [embed], components: [row] })
        } else if (setup) {
            message.reply(`You've already setup tickets for this guild! \n > We are trying to make a new way for you to make mutliple tickets!`)
        }
    }
}
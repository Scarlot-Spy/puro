const { Permissions, PermissionFlagsBits, MessageActionRow, MessageButton } = require('discord.js'), Discord = require('discord.js')
const ticketModel = require('../models/ticket')

module.exports = {
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
    async execute(interaction) {
        const button1 = interaction.options.getString('button1');
        const button2 = interaction.options.getString('button2');
        const button3 = interaction.options.getString('button3');
        const description = interaction.options.getString('description');

        const setup = await ticketModel.findOne({ guildID: interaction.guild.id });

        if (!setup) {
            new ticketModel({
                guildID: interaction.guild.id,
                Buttons: [button1, button2, button3],
                Description: description
            }).save();

            interaction.reply({ content: `Successfully saved tickets!`})

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel(button1)
                .setCustomId(button1+'-'+interaction.guild.id)
                .setStyle('PRIMARY'),
                new MessageButton()
                .setLabel(button2)
                .setCustomId(button2+'-'+interaction.guild.id)
                .setStyle('PRIMARY'),
                new MessageButton()
                .setLabel(button3)
                .setCustomId(button3+'-'+interaction.guild.id)
                .setStyle('PRIMARY')
            )
            const embed = new Discord.MessageEmbed()
            .setTitle('Tickets - '+interaction.guild.name)
            .setDescription(description)
            .setColor("RANDOM")
            .setFooter({ text: 'Tickets • Puro' })

            interaction.channel.send({ embeds: [embed], components: [row]})
        } else if (setup) {
            interaction.reply(`You've already setup tickets for this guild! \n > We are trying to make a new way for you to make mutliple tickets!`)
        }
    }
}
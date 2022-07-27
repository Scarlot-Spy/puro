const { Permissions, PermissionFlagsBits, MessageActionRow, MessageButton } = require('discord.js'), Discord = require('discord.js')
const ticketModel = require('../models/tickets')

module.exports = {
    category: `Tickets`,
    name: "close-ticket",
    description: "Close someones ticket!",
    dm_permission: false,
    default_member_permissions: Permissions.FLAGS.MANAGE_GUILD.toString().replace('n', ''),
    options: [
        {
            type: 3,
            name: 'id',
            description: "The ticket ID provided in the ticket description!",
            required: true,
        },
    ],
    async execute(interaction) {
        const id = interaction.options.getString('id');

        const channel = interaction.guild.channels.cache.get(id);
        if (!channel) return interaction.reply({ content: `ID invalid!`, ephemeral: true});
        const ticket = await ticketModel.findOne({ guildID: interaction.guild.id, channelID: channel.id });
        if (!ticket) return interaction.reply({ content: `Ticket not found!`, ephemeral: true });
        await ticketModel.deleteOne({ guildID: interaction.guild.id, channelID: channel.id });
        interaction.reply({ content: "Closing the ticket!", ephemeral: true })
        channel.send(`Closing ticket...`)
        setTimeout(() => {
            channel.delete()
        }, 1500)
    },
};
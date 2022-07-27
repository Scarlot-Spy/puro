const { Permissions, PermissionFlagsBits, MessageActionRow, MessageButton } = require('discord.js'), Discord = require('discord.js')
const ticketModel = require('../models/tickets')

module.exports = {
    usage: `<Close ID>`,
    category: `Tickets`,
    name: "close-ticket",
    description: "Close someones ticket!",
    dm_permission: false,
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply(`❌ | You don't have the right privileges to use this command!`);
        if (!args[0] || args.length === 0) return message.reply(`You must provide a close ID!`);

        const id = args[0];
        const reason = args.slice(1).join(" ") || "Finished with the user!";

        const channel = message.guild.channels.cache.get(id);
        if (!channel) return message.reply(`ID invalid!`);
        const ticket = await ticketModel.findOne({ guildID: message.guild.id, channelID: channel.id });
        if (!ticket) return message.reply(`Ticket not found!`);
        await ticketModel.deleteOne({ guildID: message.guild.id, channelID: channel.id });
        channel.send(`Closing ticket...`)
        setTimeout(() => {
            channel.delete()
        }, 1500)
    },
};
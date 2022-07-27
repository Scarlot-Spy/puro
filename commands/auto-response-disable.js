const { Permissions, PermissionFlagsBits } = require('discord.js')
const guildModel = require('../models/guild')

module.exports = {
    category: `Automatic reply`,
    name: "auto-response-disable",
    description: "Disable all words!",
    dm_permission: false,
    default_member_permissions: Permissions.FLAGS.MANAGE_GUILD.toString().replace('n', ''),
    async execute(interaction) {
        const guildConfig = await guildModel.findOne({ guildID: interaction.guild.id });

        if (guildConfig) {
          try {
            await guildModel.deleteOne({ guildID: interaction.guild.id });
            interaction.reply({
                content: `> Deleted the words.\n\n> We've deleted the words forever from this guild!\n\n**You can now say the words you added previously**`
            })
          } catch (error) {
            console.log(error)
          }
        } else {
            return interaction.reply({ content: "You don't have any words saved!\n\n **Try again when you saved some words!**"})
        }
    }
}
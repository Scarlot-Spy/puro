const { Permissions, PermissionFlagsBits } = require('discord.js')
const guildModel = require('../models/guild')

module.exports = {
    category: `Automatic reply`,
    name: "auto-response-enable",
    description: "Enable a certain word to be automatically reponded to by the bot.",
    dm_permission: false,
    default_member_permissions: Permissions.FLAGS.MANAGE_GUILD.toString().replace('n', ''),
    options: [
        {
            type: 3,
            name: 'word',
            description: "Set a specific word to be automatically replied to by the bot",
            required: true,
        },
        {
            type: 3,
            name: 'reply',
            description: "Set a specific reply to be automatically sent to by the bot",
            required: true,
        },
    ],
    async execute(interaction) {
        const word = interaction.options.getString('word');
        const reply = interaction.options.getString('reply');
        const guildConfig = await guildModel.findOne({ guildID: interaction.guild.id });

            if (!guildConfig) {
                new guildModel({
                    guildID: interaction.guild.id,
                    array: [
                        {
                            word: word.trim(),
                            reply: reply
                        }
                    ]
                }).save()
                return interaction.reply(`Saved \`${word}\` to be replied with \`${reply}\`!`)
            } else if (guildConfig) {
                for (var i = 0; i < guildConfig.array.length; i++) {
                    if (guildConfig.array[i].word === word.trim()) {
                        guildConfig.array[i].reply = reply
    
                        guildConfig.save()
    
                        return interaction.reply(`Edited \`${word}\` to be replied with \`${reply}\`!`)
                    } else {
                        guildConfig.array.push({
                            word: word.trim(),
                            reply: reply
                        })
    
                        guildConfig.save()
    
                        return interaction.reply(`Saved \`${word}\` to be replied with \`${reply}\`!`)
                    }
                }
            }
    }
}
const { Permissions, PermissionFlagsBits } = require('discord.js')
const guildModel = require('../models/guild')

module.exports = {
    usage: `<Word> <Reply>`,
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
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply(`❌ | You don't have the right privileges to use this command!`)

        if (!args || args.length === 0) return message.reply(`You must provide a \`word\` and \`reply\`.`)

        const word = args[0];
        const reply = args.slice(1).join(" ");

        const guildConfig = await guildModel.findOne({ guildID: message.guild.id });

        if (!guildConfig) {
            new guildModel({
                guildID: message.guild.id,
                array: [
                    {
                        word: word.trim(),
                        reply: reply
                    }
                ]
            }).save()
            return message.reply(`Saved \`${word}\` to be replied with \`${reply}\`!`).catch(console.log)
        } else if (guildConfig) {
            for (var i = 0; i < guildConfig.array.length; i++) {
                if (guildConfig.array[i].word === word.trim()) {

                    const save = new Promise((resolve, reject) => {
                        try {
                            guildConfig.array[i].reply = reply.toString()

                            guildConfig.save()
                            resolve(`done`)
                        } catch (e) {
                            reject(e.toString())
                        }
                    })

                    save.then(() => {
                        return message.reply(`Edited \`${word}\` to be replied with \`${reply}\`!`).catch(console.log)
                    }).catch(console.log)
                } else {
                    guildConfig.array.push({
                        word: word.trim(),
                        reply: reply
                    })

                    guildConfig.save()

                    return message.reply(`Saved \`${word}\` to be replied with \`${reply}\`!`).catch(console.log)
                }
            }
        }
    }
}
const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id == msg.author.id;

    const embed = new Discord()
        .setTitle('Available Options')
        .setDescription(`
            Yes
            No
        `)
        .setColor(0xdd9323)
        .setFooter(`ID: ${msg.author.id}`);

    msg.channel.send(embed);
};

exports.help = {
    name: 'roles'
};

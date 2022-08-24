const Event = require('../classes/Event.js');
const log = require('../classes/Logger.js');
const {MessageEmbed} = require('discord.js');

const guildMemberAdd = new Event(client, async (member) => {
    const embed = new MessageEmbed()
    .setImage(member.displayAvatarURL())
    .setDescription(`Ласкаво просимо на сервері, ${member}! Новачок під іменем ${member.user.tag} уже ${member.guild.memberCount}-й\n`)
    .setColor(0x00aa00)

    await client.users_channel.send({embeds: [embed]});

    client.connection.query(`SELECT 1 FROM member WHERE id = ${member.id}`, (err, rows) => {
        if(rows && !rows[0] && !member.user.bot) {
            client.connection.query(`INSERT INTO members (id) VALUES(${member.id})`, err => {
                if(err) log(err, 'error')
            })
        }
    })
});

module.exports = guildMemberAdd;
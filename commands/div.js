const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const ErrorAlarm = require('../classes/ErrorAlarm.js');
const divinations = require('../config.json').divinations;

const div = new Command(client, {
    name: 'div',
    description: 'Команда для гадання',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    const member = await client.guild.members.fetch(message.author.id);
    client.connection.query(`SELECT * FROM members WHERE id = ${message.author.id}`, (error, rows) => {
        const current_date = new Date().toLocaleDateString('uk-UA', { timeZone: 'Europe/Kiev' });
        log(`${current_date} || ${rows[0].last_divination_date}`);
        if(rows[0].last_divination_date != current_date) {
            client.connection.query(`UPDATE members SET last_divination_date = \"${current_date}\" WHERE id = ${message.author.id}`)
            const msg = divinations[Math.floor(Math.random() * divinations.length)];
            message.channel.send({
                content: `${message.author}`,
                embeds: [{
                    title: 'Ворожіння',
                    description: msg,
                    hexColor: '#50044D'
                }]
            })
        } else {
            new ErrorAlarm({
                description: 'Ви на сьогодні уже запитували ворожіння! Спробуйте завтра',
                color: '#891928',
                channel: message.channel
            })
        }
    })
})

module.exports = div;
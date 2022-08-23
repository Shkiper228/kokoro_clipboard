const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');

const div = new Command(client, {
    name: 'div',
    description: 'Команда для гадання',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    client.connection.query(`SELECT * FROM members WHERE id = ${message.author.id}`, (error, rows) => {
        const current_date = new Date().toLocaleDateString('uk-UA', { timeZone: 'Europe/Kiev' });
        log(current_date);
        rows.last_divination
    })
})

module.exports = div;
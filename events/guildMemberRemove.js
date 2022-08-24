const Event = require('../classes/Event.js');
const log = require('../classes/Logger.js');

function formatCurrentTime() {
    const time = new Date().toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kiev' })

    const seconds = Number(time.split(':')[2]) < 10 ? `0${Number(time.split(':')[2])}` : `${Number(time.split(':')[2])}`;
    const minutes = Number(time.split(':')[1]) < 10 ? `0${Number(time.split(':')[1])}` : `${Number(time.split(':')[1])}`;
    const hours = Number(time.split(':')[0]) < 10 ? `0${Number(time.split(':')[0])}` : `${Number(time.split(':')[0])}`;

    return `${hours}:${minutes}:${seconds}`;
}

const guildMemberRemove = new Event(client, async (member) => {
    client.users_channel.send({embeds: [{
        description: `${member} під іменем ${member.user.tag} покинув сервер о ${formatCurrentTime()}\n`,
        color: 0xaa0000
    }]});
});

module.exports = guildMemberRemove;
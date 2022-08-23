const Event = require('../classes/Event.js');
const PrivatChannel = require('../classes/PrivatChannel.js');

const voiceStateUpdate = new Event(client, async (oldState, newState) => {
    if(newState.channelId == client.creatende_privat_voice.id) {
        const channel = new PrivatChannel(client, newState.member.user.id);
        await channel.init();
        client.privat_voices.push(channel);
    }

    client.privat_voices.forEach(async (voice, index) => {
        if(oldState.channelId == voice.channel.id && oldState.channel.members.size == 0) {
            client.connection.query(`DELETE FROM privat_channels WHERE id=${voice.channel.id}`)
            await voice.channel.delete();
            client.privat_voices.splice(index, 1)
        }
    });
});

module.exports = voiceStateUpdate;
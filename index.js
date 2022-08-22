const Kokoro = require('./classes/Kokoro.js');
const log = require('./classes/Logger.js');

client = new Kokoro();

client.on('ready', () => {
    log(`Logged as ${client.user.tag}`)
    client.init();
})

client.login();
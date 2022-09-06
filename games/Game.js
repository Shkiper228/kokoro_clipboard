const {log} = require('../classes/Logger.js')

class Game {
    constructor(client, game){
        this.client = client;
        this.game = game;
        if(!client.games) client.games = [];
        this.index = client.games.length;
        client.games.push(this);

        this.numbers_emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '0️⃣'];
    }

    async delete () {
        this.client.games.splice(this.index, this.index);
        //await this.channel.delete();
        log('Успішно видалено')
    }
}

module.exports = Game;
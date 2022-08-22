class Book {
    constructor (client, channel_id) {
        this.channel_id = channel_id;
        this.client = client;
    }
    emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '0️⃣'];
}

module.exports = Book;
class ErrorAlarm {
    constructor({
        description = 'Помилка',
        color = '#FF0000',
        channel = undefined
    }) {
        this.description = description;
        this.color = color;
        this.channel = channel;

        this.init();
    }

    async init () {
        if(this.channel == undefined) {
            log('Не вказано каналу для ErrorAlarm', 'error')
            return
        }

        try {
            this.message = await this.channel.send({embeds: [{
                description: this.description,
                color: this.color
            }]})
        } catch (error) {
            log('Не вдалось написати ErrorAlarm', 'error')
            return
        }
    }
}

module.exports = ErrorAlarm;
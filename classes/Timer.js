const log = require('../classes/Logger.js');

function getDaysMonthYears(days, month, year) {
    const x = [
        () => {return 31},
        () => {return year % 4 == 0 ? 29 : 28},
        () => {return 31},
        () => {return 30},
        () => {return 31},
        () => {return 30},
        () => {return 31},
        () => {return 31},
        () => {return 30},
        () => {return 31},
        () => {return 30},
        () => {return 31}
    ]
    

    while(days > x[month - 1]()) {
        log(x[month - 1]())
        days -= x[month - 1]();
        month++;
        if(month > 12) {
            month = 1;
            year++;
        }
    }

    return [days, month, year]
}

class Timer {
    constructor(client, time, channelId, title, description, sender, color, id = -1, isReg = false) {
        this.client = client;
        this.time = Number(time); //хвилин
        this.channelId = channelId;
        this.title = title;
        this.description = description;
        this.sender = sender;
        this.color = color;
        this.id = id;
        this.isReg = isReg;

        this.init();
    }

    async init () {
        

        this.client.connection.query(`CREATE TABLE IF NOT EXISTS timers ( 
			id INT NOT NULL AUTO_INCREMENT ,
			date_time VARCHAR(19) NOT NULL ,
            channel VARCHAR(20) NOT NULL ,
            title VARCHAR(255),
            description VARCHAR(255) ,
            sender VARCHAR(23) ,
            color VARCHAR(6) ,
			PRIMARY KEY (id)
			)`
		)
        
        

        let amountMin = this.time

        if(!this.isReg) {
            amountMin = this.time * 60
            //формування кінцевого часу таймеру
            const dateTimeStr = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })

            const   date = dateTimeStr.split(', ')[0],
                    time = dateTimeStr.split(', ')[1]


            const   currentYear =   Number(date.split('.')[2]),
                    currentMonth =  Number(date.split('.')[1]),
                    currentDay =    Number(date.split('.')[0]),
                    currentHour =   Number(time.split(':')[0]),
                    currentMinute = Number(time.split(':')[1]),
                    currentSecond = Number(time.split(':')[2])


            

            const second = currentSecond;
            const minute = (currentMinute + this.time) % 60;
            this.time = Math.floor((currentMinute + this.time) / 60);

            const hour = (currentHour + this.time) % 24;
            this.time = Math.floor((currentHour + this.time) / 24);

            const a = getDaysMonthYears(this.time + currentDay, currentMonth, currentYear);
            const   day = a[0],
                    month = a[1],
                    year = a[2]


            this.formedDateTime = `${year}.${month < 10 ? '0' + month: month}.${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;


            const sql = `INSERT INTO timers (date_time, channel, title, description, sender, color) VALUES(\"${this.formedDateTime}\", \"${this.channelId}\", \"${this.title}\", \"${this.description}\", \"${this.sender}\", \"${this.color}\")`;
            this.client.connection.query(sql, (error, rows, fields) => {
                if(error) {
                    console.log(`Трапилась помилка під час запису таймеру до бази даних: \n${error}`, 'error');
                }
                this.id = rows.insertId;
            })
        } else {
            amountMin = this.time
        }

        this.channel = await client.guild.channels.fetch(this.channelId);
        setTimeout(async () => {
            this.channel.send({
                content: this.sender,
                embeds: [{
                    title: this.title,
                    description: this.description
                }]})
            this.remove();
        }, amountMin * 1000)


    }

    remove () {
        this.client.connection.query(`DELETE FROM timers WHERE id = ${this.id}`);
    }
}

module.exports = Timer;
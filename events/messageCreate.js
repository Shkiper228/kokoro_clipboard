const Event = require('../classes/Event.js');
const log = require('../classes/Logger.js');
const Timer = require('../classes/Timer.js');


async function bump_check(client, message) {
    if(message.author.id === '315926021457051650' && message.embeds[0].description.indexOf('Server bumped by') != -1){
        log(message.embeds[0].color);
        const bumper = await client.guild.members.fetch(message.embeds[0].description.slice(message.embeds[0].description.indexOf('<@') + 2, message.embeds[0].description.indexOf('<@') + 20))
        await message.channel.send({embeds:[{
            description: `${bumper} бамп успішний. Таймер запущено`,
            hexColor: '#43B582'
        }]})

        new Timer(client, 4*60, message.channelId, 'Пора бампити!', `Час для наступного бампу пройшов\nПопросіть кого-небудь зробити бамп сервера`, `${bumper}`, '43B582');
    }
}

async function random_reaction(client, message) {
    const chance = 4;
    if(Math.ceil(Math.random()*100) <= chance && await client.guild.emojis.cache.size > 0){
        const emojis = await client.guild.emojis.fetch();
        
        message.react(emojis.random());

    } else if(await client.guild.emojis.cache.size == 0) {
        log('На сервері немає емодзі, тому випадкові реакції під повідомленнями неможливі. Якщо ви хочете, аби вона запрацювали - добавте емодзі на сервері', 'warning')
    }
}

async function updateXP(client, message, member) {
    client.connection.query(`SELECT * FROM members WHERE id = ${message.author.id}`, async (error, rows) => {
        if(rows) {
            let expForNextLvl = 0;
            for(let i = 1; i < rows[0].level + 1; i++){
                expForNextLvl += (5 * Math.pow(i, 2)) + (50 * i) + 100;
                
            }

            const exp = rows[0].experience;
            if(exp >= expForNextLvl) {
                rows[0].level++;
                const console = await client.guild.channels.fetch(client.config.console);
                await console.send({
                    content: `${member}`,
                    embeds: [{
                        description: `Ви досягнули ${rows[0].level} рівень! Вітаєм!`,
                        hexColor: '#2D7144'
                    }]
                })
            };
            client.connection.query(`UPDATE members SET experience = ${exp + Math.floor(Math.random() * 10) + 15}, 
            level = ${rows[0].level}, messages = ${rows[0].messages + 1} WHERE id = ${message.author.id}`)
        }
    })
}


async function check_adds(client, message, member) {
    if(message.content.indexOf('https://discord.gg/') != -1) { //провірка, чи це посилання на діскорд сервер
        log('Знайдено посилання на діскорд сервер', 'warning')
        const role = member.roles.highest.name.toLowerCase(); //найвища роль
        
        let isOk = false;
        await message.guild.invites.fetch().then(links => {
            links.forEach(link => {
                if(message.content.indexOf(link.toString()) != -1){ //все в порядку, це посилання на наш сервер
                    isOk = true
                    log('Все в порядку. Посилання на цей сервер')
                }
            })
        })


        
        if(role == 'vip' || role == 'support'  || role == 'underground' || role == 'guard' || role == 'admin' || role == 'redactor' || role == 'leader' ){ //дозвіл вищим ролям
            log('Роль з превілегією, якій дозволено надсилати посилання на інший діскорд сервер', 'warning');
            isOk = true;
        }

        

        
        

        if(!isOk) {
            const offender = member.user; //порушник
            let err = false;

            let banMessage = await offender.send({embeds: [{
                description: 'Ви рекламували посторонній діскорд сервер на сервері _Weisttil_, за що вас було автоматично перманентно забанено. Наступного разу уважніше читайте правила!'
            }]})


            member.ban({reason: 'Реклама посторонніх діскорд серверів'})
                .catch(async () => {
                    log(`Не вдалось забанити порушника ${message.author} під ніком ${message.author.username}. Щось пішло не так`, 'error')
                    err = true;
                    banMessage.delete();
                })


            if(!err) {
                await client.owner.send({embeds: [{
                        description: `${message.author} рекламував інший діскорд сервер на сервері _Weisttil_!`
                }]})
            }

            await message.delete();
        } 
    }
}


async function command_handler(client, message, member) {
    const prefix = client.config.prefix;
    if(message.content.toLowerCase().startsWith(prefix)) { //команду ідентифіковано
        message.content = message.content.slice(prefix.length); //забираємо рефікс

        for (let cname in client.commands) {

            if ((message.content.toLowerCase() === cname || message.content.startsWith(`${cname} `)) && (!client.commands[cname].ownerOnly || member.id == client.owner)) {
      
                let args = message.content.slice(cname.length).split(' ').filter(el => el != '');

                await client.commands[cname].run(client, message, args);
            } else if((message.content === cname || message.content.startsWith(`${cname} `)) && client.commands[cname].ownerOnly) {
                new ErrorAlarm({
                    description: `${member}, ви не маєте права використовувати цю команду. Вона лише для розробника`,
                    channel: message.channel
                })
            }
        }
    }
}









const messageCreate = new Event(client, async message => {
    //bump check
    bump_check(client, message);


    //is author bot
    if (message.author.bot || message.channel.type == 'DM' || message.channel.type == 'GROUP_DM') return; //команди від користувачів, які є ботами та повідомлення в дірект або групи не працюватимуть
    log(`<${message.channel.name}> [${message.author.tag}] ${message.content}`, 'message');

    const member = await message.guild.members.fetch(message.author.id);


    //random reaction
    random_reaction(client, message);

    
    //updateXP
    //updateXP(client, message, member)


    //check adds
    //check_adds(client, message, member);
    

    
    //commands handler
    const prefix = client.config.prefix;
    command_handler(client, message, member);


    /*
    //chat
    if(message.content.trim().indexOf('<@&868886871948804197>') != -1 || message.content.trim().indexOf('<@!868884079221809223>') != -1 || message.content.trim().indexOf('<@868884079221809223>') != -1) {
        log(Math.floor(Math.random() * chat.mention.answers.length))
        await message.channel.send(chat.mention.answers[Math.floor(Math.random() * chat.mention.answers.length)])
    }

    chat.helloWords.triggers.forEach(async trigger => {
        if(message.content.trim().toLowerCase() == trigger.trim().toLowerCase()){
            log(message.content.trim().toLowerCase())
            log(trigger.trim().toLowerCase())
            let answer = chat.helloWords.answers.general[Math.floor(Math.random() * chat.helloWords.answers.general.length)];
            await message.channel.send(`${answer[0].toUpperCase()}${answer.slice(1)}`)
        }
    })

    //emotions and actions
    m_a.forEach(async element => {
        if(message.content.trim().toLowerCase() === element.key.toLocaleLowerCase().trim()) {
            await message.channel.send({ embeds: [{
                description: `${message.author} ${element.answer}`,
                image: {
                    url: 'https://tenor.com/view/%D0%B0%D0%B1%D0%BE%D0%B1%D1%83%D1%81-%D0%B4%D0%B0%D1%88%D0%B0-%D0%BA%D0%BE%D1%80%D0%B5%D0%B9%D0%BA%D0%B0-gif-22153053'
                }
            }]});
            await message.delete();
            log(1);
        }
    })*/
})

module.exports = messageCreate;
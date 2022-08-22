const { Invite } = require("discord.js");

class PrivatChannel {
    constructor (client, owner) {
        this.client = client;
        this.ownerId = owner;
    }

    async init () {
        this.owner = await this.client.guild.members.fetch(this.ownerId);
        this.channel = await this.client.guild.channels.create(`🔒 ${this.owner.user.tag}`, {
            type: 'GUILD_VOICE',
            parent: this.owner.voice.channel.parent,
            userLimit: 2,
            permissionOverwrites: [
                {
                    id: this.owner.user.id,
                    allow: 'MANAGE_CHANNELS'
                }
            ]
        })

        this.owner.edit({
            channel: this.channel
        })

        this.client.connection.query(`CREATE TABLE IF NOT EXISTS privat_channels ( 
			id VARCHAR(20) NOT NULL ,
			owner VARCHAR(22),
			PRIMARY KEY (ID)
			)`
		)

        this.client.connection.query(`INSERT INTO privat_channels (id, owner) VALUES(\"${this.channel.id}\", \"${this.owner}\")`);
    }
}

module.exports = PrivatChannel;
class Command {
    constructor(client ,{
        name = '',
        description = '',
        syntax = `${client.config.prefix}${name}`,
        ownerOnly = false,
        adminOnly = false
    }, run) 
    
    {
        this.name = name;
        this.description = description;
        this.syntax = syntax;
        this.ownerOnly = ownerOnly;
        this.adminOnly = adminOnly;
        this.run = run;
    }
}

module.exports = Command;
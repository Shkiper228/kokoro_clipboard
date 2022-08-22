class Event {
    constructor(client, run, args = []){
        this.name = __filename;
        this.run = run;
    }
}

module.exports = Event;
class Logger {
    constructor(db) {
        this.db = db;
    }

    LogError(er) {
        if (!this.db || !this.db.collection) {
            console.log("ERROR", er);
            return;
        }
        this.db.collection("errorLogs").insertOne(er);
    }
}

module.exports = Logger;
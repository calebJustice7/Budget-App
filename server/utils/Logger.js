class Logger {
    constructor(db) {
        this.db = db;
    }

    LogError(er) {
        this.db.collection("errorLogs").insertOne(er);
    }
}

module.exports = Logger;
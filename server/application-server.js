const express = require("express");
const cors = require("cors");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const BodyParser = require("body-parser");
const path = require("path");
const CheckToken = require("./middleware/check-token");

class ApplicationServer {
    constructor(configuration) {
        this.configuration = configuration;
    }

    async _establishMongoConnection() {
        return new Promise(async (resolve, reject) => {
            MongoClient.connect(`mongodb://${this.configuration.databaseHost}:${this.configuration.databasePort}/new-backend`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (err, db) => {
                if (err) {
                    reject(new Error(`Error connecting to database ${err}`));
                    return;
                } else {
                    try {
                        this.dbConnection = db.db(this.configuration.databaseName);
                        resolve();
                        return;
                    } catch (ex) {
                        reject(`Error trying to establish connection to the database ${ex}`);
                        return;
                    }
                }
            });
        });
    }

    async StartServer() {
        try {
            // await this._establishMongoConnection();
            app.locals.dbConnection = this.dbConnection;
            app.locals.configuration = this.configuration;
            app.use(cors({origin: "*",optionsSuccessStatus: 200,methods: ["GET", "PUT", "POST", "OPTIONS", "DELETE"],credentials: true,allowedHeaders: ["Content-Type", "Authorization"]}));
            app.options("*", cors({origin: "*",optionsSuccessStatus: 200,methods: ["GET", "PUT", "POST", "OPTIONS", "DELETE"],credentials: true,allowedHeaders: ["Content-Type", "Authorization"]}));
            app.use(BodyParser.urlencoded({ extended: true, limit: '20mb' }));
            app.use(BodyParser.json({ limit: '20mb' }));

            app.use(new CheckToken());

            app.get('/api/healthcheck', (req, res) => {
                res.status(200).send("OK");
            })
            app.use('/api/auth', require('./routes/auth/auth'));
            app.use('/api/auth/refresh_token', require("./routes/auth/refresh-token"));
            app.use('/api/plaid_token', require("./routes/plaid/plaid-token"));
            app.use('/api/records', require("./routes/plaid/records"));
            app.use('/api/user_profile', require("./routes/user/user-profile"));

            app.use(express.static(path.join(__dirname, "../client/", "dist/")));

            app.listen(this.configuration.portNumber, () => {
                console.log("Application Server started on port " + this.configuration.portNumber);
                return true
            })
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = ApplicationServer;
const express = require('express');
const router = express.Router();
const Logger = require("../../utils/Logger");
const plaid = require('plaid');
const moment = require("moment");

let config;
let client;

function _configurePlaid(clientId, clientSecret) {
    return new Promise((resolve, reject) => {
        try {
            config = new plaid.Configuration({
                basePath: plaid.PlaidEnvironments.sandbox,
                baseOptions: {
                    headers: {
                        'PLAID-CLIENT-ID': clientId,
                        'PLAID-SECRET': clientSecret
                    }
                }
            })
            client = new plaid.PlaidApi(config);
            resolve();
        } catch(e) {
            reject(e);
        }
    })
}

async function _getAccounts(chainObject) {
    try {
        if (!chainObject.accounts) {
            throw new Error("No accounts for user " + chainObject.currentUserId);
        }
        let accounts = await client.accountsGet({access_token: chainObject.accounts[0]});
        if (!accounts) {
            throw new Error("Error finding accounts");
        }
        chainObject.accounts = accounts.data;
        return chainObject;
    } catch(e) {
        throw new Error(e);
    }
}

async function _getAccountsWithAccessToken(chainObject) {
    try {
        if (!chainObject.accessToken) {
            throw new Error("No access_token for user " + chainObject.currentUserId);
        }
        let accounts = await client.accountsGet({access_token: chainObject.accessToken});
        if (!accounts) {
            throw new Error("Error finding accounts");
        }
        chainObject.accounts = accounts.data;
        return chainObject;
    } catch(e) {
        throw new Error(e);
    }
}

async function _getTransactions(chainObject) {
    try {
        if (!chainObject.accounts) {
            throw new Error("No accounts for user " + chainObject.currentUserId);
        }
        let today = moment().format('YYYY-MM-DD');
        let past = moment().subtract(30, 'days').format('YYYY-MM-DD');
        let transactions = await client.transactionsGet({access_token: chainObject.accounts[0], start_date: past, end_date: today});
        if (!transactions) {
            throw new Error("Error finding transactions");
        }
        chainObject.transactions = transactions.data;
        return chainObject;
    } catch(e) {
        throw new Error(e);
    }
}

router.get('/transactions', (req, res) => {
    let logger = new Logger(req.app.locals.dbConnection);

    let cont = true;
    if (!config) {
        _configurePlaid(req.app.locals.configuration.plaid_client_id, req.app.locals.configuration.plaid_secret)
            .catch((e) => {
                res.status(500).send({error: 'Error connecting to plaid'});
                logger.LogError({message: e.toString()});
                cont = false;
            })
    }
    if (!cont) return;

    _getTransactions({
        db: req.app.locals.dbConnection,
        currentUserId: req.currentUserId,
        accounts: req.currentUserAccounts
    })
        .then((chainObject) => {
            res.status(200).json({transactions: chainObject.transactions});
        })
        .catch(err => {
            logger.LogError({message: err.toString()});
            res.status(500).send({error: 'plaid error'});
        })
});

router.post('/account', (req, res) => {
    let logger = new Logger(req.app.locals.dbConnection);

    let cont = true;
    if (!config) {
        _configurePlaid(req.app.locals.configuration.plaid_client_id, req.app.locals.configuration.plaid_secret)
            .catch((e) => {
                res.status(500).send({error: 'Error connecting to plaid'});
                logger.LogError({message: e.toString()});
                cont = false;
            })
    }
    if (!cont) return;

    _getAccountsWithAccessToken({
        db: req.app.locals.dbConnection,
        currentUserId: req.currentUserId,
        accessToken: req.body.access_token
    })
        .then((chainObject) => {
            res.status(200).json({accounts: chainObject.accounts});
        })
        .catch(err => {
            logger.LogError({message: err.toString()});
            res.status(500).send({error: 'plaid error'});
        })
});

router.get('/accounts', (req, res) => {
    let logger = new Logger(req.app.locals.dbConnection);

    let cont = true;
    if (!config) {
        _configurePlaid(req.app.locals.configuration.plaid_client_id, req.app.locals.configuration.plaid_secret)
            .catch((e) => {
                res.status(500).send({error: 'Error connecting to plaid'});
                logger.LogError({message: e.toString()});
                cont = false;
            })
    }
    if (!cont) return;

    _getAccounts({
        db: req.app.locals.dbConnection,
        currentUserId: req.currentUserId,
        accounts: req.currentUserAccounts
    })
        .then((chainObject) => {
            res.status(200).json({accounts: chainObject.accounts});
        })
        .catch(err => {
            logger.LogError({message: err.toString()});
            res.status(500).send({error: 'plaid error'});
        })
});

module.exports = router;
const express = require('express');
const router = express.Router();
const plaid = require('plaid');
const Logger = require("../../utils/Logger");
// const mongodb = require('mongodb');

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

async function _findUser(chainObject) {
    let userRes = await chainObject.db.collection('users').findOne({_id: chainObject.id});
    if (!userRes) {
        throw new Error("Error attempting to find user when getting plaid link token");
    }
    chainObject.user = userRes.user;
    return chainObject;
}

async function _plaidLinkTokenRequest(chainObject) {
    try {
        const request = { 
            user: {
                client_user_id: chainObject.id
            },
            client_name: 'Lint', 
            products: ['transactions'],
            language: 'en',
            country_codes: ['US']
        }
        const createTokenResponse = await client.linkTokenCreate(request);
        chainObject.tokenResponse = createTokenResponse.data;
        return chainObject;
    } catch(e) {
        throw new Error(e);
    }
}

router.get('/create_link_token', (req, res) => {
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
    
    _findUser({
        db: req.app.locals.dbConnection,
        id: req.currentUserId
    })
        .then(chainObject => {
            return _plaidLinkTokenRequest(chainObject);
        })
        .then(chainObject => {
            res.status(200).send({data: chainObject.tokenResponse});
        })
        .catch(err => {
            logger.LogError({message: err.toString()});
            res.status(500).send({error: 'Error creating plaid link token'});
        })
})

async function _exchangePublicToken(chainObject) {
    try {
        let response = await client.itemPublicTokenExchange({public_token: chainObject.public_token});
        let accessToken = response;
        chainObject.publicToken = accessToken.data;
        return chainObject;
    } catch(e) {
        throw new Error(e);
    }
}

// async function _updateUser(chainObject) {
//     let insertRes = await chainObject.db.collection('plaidAccounts').insertOne({...chainObject.publicToken, userId: chainObject.currentUserId});
//     let updateRes = await chainObject.db.collection('users').updateOne({_id: chainObject.currentUserId}, {$push: {plaidAccounts: chainObject.publicToken.access_token}}, {upsert: true});
//     if (!insertRes || !updateRes) {
//         throw new Error("Error inserting plaid account");
//     }

//     return chainObject;
// }

router.post('/get_access_token', async (req, res) => {
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

    _exchangePublicToken({
        db: req.app.locals.dbConnection,
        public_token: req.body.public_token,
        currentUserId: req.currentUserId
    })
        // .then(chainObject => {
        //     return _updateUser(chainObject)
        // })
        .then((chainObject) => {
            res.status(200).json({publicToken: chainObject.publicToken})
        })
        .catch(er => {
            res.status(500).send({error: 'plaid error'});
            logger.LogError({message: er.toString()});
        })
});

module.exports = router;

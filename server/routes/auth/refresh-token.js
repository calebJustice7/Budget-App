const express = require('express');
const router = express.Router();
const Logger = require("../../utils/Logger");
const Crypto = require("crypto");

async function _getToken(chainObject) {
    if (!chainObject.refresh_token) {
        throw new Error("No refresh token provided");
    }
    let tokenRes = await chainObject.db.collection('tokens').findOne({refresh_token: chainObject.refresh_token});
    if (!tokenRes) {
        throw new Error("Couldn't find token with refresh token provided: " + chainObject.refresh_token);
    }
    if (tokenRes.refresh_token_expires_at <= Date.now()) {
        throw new Error("Refresh token is expired");
    }
    chainObject.token = tokenRes;
    return chainObject;
}

async function _createAccessToken(chainObject) {
    try {
        let access_token = await Crypto.randomBytes(256).toString("hex");
        await chainObject.db.collection('tokens').updateOne({refresh_token: chainObject.refresh_token}, {$set: {
            access_token: access_token,
            access_token_expires_at: Date.now() + chainObject.accessTokenExpiry
        }});
        return chainObject;
    } catch(e) {
        throw new Error(e);
    }
}

async function _fetchNewToken(chainObject) {
    let newToken = await chainObject.db.collection('tokens').findOne({refresh_token: chainObject.refresh_token});
    if (!newToken) {
        throw new Error("Critical, could not find token after updating");
    }
    delete newToken._id;
    chainObject.newToken = newToken;
    return chainObject;
}

router.post('/', (req, res) => {
    let logger = new Logger(req.app.locals.dbConnection);
    
    _getToken({
        db: req.app.locals.dbConnection,
        refresh_token: req.body.refresh_token,
        accessTokenExpiry: req.app.locals.configuration.accessTokenExpire
    })
        .then(chainObject => {
            return _createAccessToken(chainObject);
        })
        .then(chainObject => {
            return _fetchNewToken(chainObject);
        })
        .then(chainObject => {
            res.status(200).json({token: chainObject.newToken});
        })
        .catch(er => {
            res.status(401).send({error: 'Invalid refresh_token'});
            logger.LogError({message: er.toString()});
        })
})

module.exports = router;
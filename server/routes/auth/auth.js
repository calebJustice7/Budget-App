const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const Logger = require("../../utils/Logger");
const Crypto = require("crypto");

async function _createUser(chainObject) {
    let userRes = await chainObject.db.collection("users").findOne({emailAddress: chainObject.emailAddress});
    if (userRes) {
        throw new Error("User already exists");
    }
    let insertRes = await chainObject.db.collection('users').insertOne({
        emailAddress: chainObject.emailAddress,
        password: chainObject.hashedPassword,
        username: chainObject.username,
        profilePicture: null
    })
    if (!insertRes) {
        throw new Error("Error inserting user");
    } else {
        return chainObject;
    }
}

async function _createHash(chainObject) {
    if (!chainObject.emailAddress || !chainObject.username || !chainObject.password) {
        throw new Error("Missing fields when creating user");
    }
    try {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(chainObject.password, salt);
        chainObject.hashedPassword = hash;
        return chainObject;
    } catch(e) {
        throw new Error(e);
    }
}

async function _getUser(chainObject) {
    if (!chainObject.emailAddress || !chainObject.password) {
        throw new Error("Missing fields when authenticating");
    }
    let userRes = await chainObject.db.collection('users').findOne({emailAddress: chainObject.emailAddress});
    if (!userRes) {
        throw new Error("No user with email: " + chainObject.emailAddress);
    }
    chainObject.foundUser = userRes;
    return chainObject;
}

async function _compareHashes(chainObject) {
    try {
        let res = await bcrypt.compare(chainObject.password, chainObject.foundUser.password);
        if (res === true) {
            return chainObject;
        } else {
            throw new Error("Invalid login");
        }
    } catch(er) {
        throw new Error(er);
    }
}

async function _createToken(chainObject) {
    try {
        let access_token = await Crypto.randomBytes(256).toString("hex");
        let refresh_token = await Crypto.randomBytes(256).toString("hex");
        let tokenObject = {
            access_token: access_token,
            refresh_token: refresh_token,
            emailAddress: chainObject.foundUser.emailAddress,
            access_token_expires_at: new Date().getTime() + chainObject.accessTokenExpiry,
            refresh_token_expires_at: new Date().getTime() + chainObject.refreshTokenExpiry,
            scopes: []
        }
        await chainObject.db.collection('tokens').insertOne(tokenObject);
        chainObject.token = tokenObject;
        return chainObject;
    } catch(e) {
        throw new Error(e);
    }
}

router.post('/login', (req, res) => {
    let logger = new Logger(req.app.locals.dbConnection);

    _getUser({
        db: req.app.locals.dbConnection,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        accessTokenExpiry: req.app.locals.configuration.accessTokenExpire,
        refreshTokenExpiry: req.app.locals.configuration.refreshTokenExpire
    })
        .then(chainObject => {
            return _compareHashes(chainObject);
        })
        .then(chainObject => {
            return _createToken(chainObject);
        })
        .then(chainObject => {
            res.status(200).json({
                token: chainObject.token
            });
        })
        .catch(er => {
            res.status(500).send({error: 'error logging in'});
            logger.LogError({message: er.toString()});
        })
})

router.post('/', (req, res) => {
    let logger = new Logger(req.app.locals.dbConnection);

    _createHash({
        db: req.app.locals.dbConnection,
        emailAddress: req.body.emailAddress,
        username: req.body.username,
        password: req.body.password
    })
        .then(chainObject => {
            return _createUser(chainObject);
        })
        .then(() => {
            res.status(200).json({success: true});
        })
        .catch(er => {
            res.writeHead(500, er.toString(), {'content-type': 'text/plain'});
            res.end(er.toString());
            logger.LogError({message: er.toString()});
        })
});

module.exports = router;
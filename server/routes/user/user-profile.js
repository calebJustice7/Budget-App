const express = require('express');
const router = express.Router();
const Logger = require("../../utils/Logger");

async function _getUserProfile(chainObject) {
    let userRes = await chainObject.db.collection('users').findOne({_id: chainObject.currentUserId});
    if (!userRes) {
        throw new Error("Could not find user " + chainObject.currentUserId);
    }
    chainObject.user = userRes;
    return chainObject;
}

router.get('/', (req, res) => {
    let logger = new Logger(req.app.locals.dbConnection);

    _getUserProfile({
        db: req.app.locals.dbConnection,
        currentUserId: req.currentUserId,
    })
        .then((chainObject) => {
            res.status(200).json({user: chainObject.user});
        })
        .catch(err => {
            logger.LogError({message: err.toString()});
            res.status(500).send({error: 'error getting user'});
        })
});

module.exports = router;
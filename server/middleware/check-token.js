const Routes = require("./routes");
const Logger = require("../utils/Logger");

async function _getTokenFromDb(chainObject) {
    let tokenRes = await chainObject.db.collection("tokens").aggregate([
        {
            $match: {
                access_token: chainObject.token
            }
        },
        {
            $lookup: {
                from: 'users',
                foreignField: 'emailAddress',
                localField: 'emailAddress',
                as: 'user'
            },
        },
        {
            $unwind: {
                path: "$user"
            }
        }
    ]).toArray();
    if (!tokenRes || !tokenRes[0]) {
        throw new Error("Could not find token for " + chainObject.token);
    } else {
        chainObject.token = tokenRes[0];
        return chainObject;
    }
}

async function _checkTokenExpiration(chainObject) {
    if (chainObject.token.access_token_expires_at < Date.now()) {
        chainObject.expired = true;
        return chainObject;
    } else {
        chainObject.currentUserEmailAddress = chainObject.token.user.emailAddress;
        chainObject.currentUserId = chainObject.token.user._id;
        chainObject.currentUserAccounts = chainObject.token.user.plaidAccounts;
        chainObject.expired = false;
        return chainObject;
    }
}

module.exports = function() {
    return function (req, res, next) {
        let logger = new Logger(req.app.locals.dbConnection);
        try {   
            let route = Routes.routes.find(r => r.path === req.path);
            if (!route) {
                logger.LogError({message: 'No valid path found for ' + req.path});
                res.status(500).send("Invalid Path");
                // next(false);
                return;
            }
            if (route.authenticationRequired === false) {
                next();
            } else {
                if (!req.headers['authorization']) {
                    res.status(500).send("No auth header present");
                    logger.LogError({message: "No authorization header passed in"});
                } else {
                    let token = req.headers['authorization'].split(' ')[1];
                    if (token) {
                        _getTokenFromDb({
                            db: req.app.locals.dbConnection,
                            token: token
                        })
                            .then(chainObject => {
                                return _checkTokenExpiration(chainObject);
                            })
                            .then(chainObject => {
                                if (chainObject.expired === true) {
                                    res.status(401).send({message: 'Expired token'});
                                } else {
                                    req.currentUserEmailAddress = chainObject.currentUserEmailAddress;
                                    req.currentUserId = chainObject.currentUserId;
                                    req.currentUserAccounts = chainObject.currentUserAccounts;
                                    next();
                                }
                            })
                            .catch(er => {
                                logger.LogError({message: er.toString()});
                                res.status(500).send({error: 'invalid login'});
                            })
                    } else {
                        res.status(500).send("No token provided");
                        logger.LogError({message: 'No token found in authorization header'});
                    }
                }
            }
        } catch(er) {
            logger.LogError({message: er.toString()});
        }
    }
}
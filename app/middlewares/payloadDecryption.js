const Encryption = require('../services/encryption');

function decryptPayload(req, res, next) {
    try {
        const payload = req.body.body;
        const decryptedPayload = Encryption.decryptWithAES256(payload);
        req.body = decryptedPayload;
        next();
    } catch (error) {
        return res.send(error);
    }
}

module.exports = {
    decryptPayload
}

const Encryption = require('../services/encryption');

function decryptPayload(req, res, next) {
    try {
        const payload = req.body.payload;
        if (process.env.NODE_ENV === 'production') {
            const decryptedPayload = Encryption.decryptWithAES256(payload);
            req.body = decryptedPayload;
        } else {
            req.body = req.body.payload;
        }

        next();
    } catch (error) {
        return res.send(error);
    }
}

module.exports = {
    decryptPayload
}

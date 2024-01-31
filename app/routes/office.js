const officeDetails = require('../controllers/office/officeDetails');
const payloadMiddleware = require('../middlewares/payloadDecryption');

function includeRoutes(app) {
    try {
        const SUB_ROUTE = '/office';

        app.get(SUB_ROUTE + '/test', (req, res) => {
            return res.send({ message: 'project is running' });
        });
    
        app.post(SUB_ROUTE + '/add-office', [
            payloadMiddleware.decryptPayload,
            officeDetails.addOffice
        ]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    includeRoutes
}

const officeDetails = require('../controllers/office/officeDetails');

function includeRoutes(app) {
    try {
        // const SUB_ROUTE = '/office';

        app.get('/test2', (req, res) => {
            return res.send({ message: 'project is running' });
        });
    
        app.post('/company', [
            // payloadMiddleware.decryptPayload,
            officeDetails.addCompany
        ]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    includeRoutes
}

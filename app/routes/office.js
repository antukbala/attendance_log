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

        app.post('/office', [
            // payloadMiddleware.decryptPayload,
            officeDetails.addOffice
        ]);

        app.post('/department', [
            // payloadMiddleware.decryptPayload,
            officeDetails.addDepartment
        ]);

        app.post('/designation', [
            // payloadMiddleware.decryptPayload,
            officeDetails.addDesignation
        ]);

        app.post('/employee', [
            // payloadMiddleware.decryptPayload,
            officeDetails.addEmployee
        ]);

        app.get('/company', [
            officeDetails.getAllCompany
        ]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    includeRoutes
}

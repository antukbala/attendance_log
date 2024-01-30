const officeDetails = require('../controllers/office/officeDetails');

function includeRoutes(app) {
    try {
        const SUB_ROUTE = '/office';

        app.get(`${SUB_ROUTE}/test`, (req, res) => {
            return res.send({ message: 'project is running' });
        });
    
        app.post(`${SUB_ROUTE}/add-office`, [
            officeDetails.addOffice
        ]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    includeRoutes
}

const login = require('../controllers/login/login');

function includeRoutes(app) {
    try {
        const SUB_ROUTES = '/login';

        app.get(SUB_ROUTES + '/test', (req, res) => {
            return res.send('project is running on login routes');
        });
    
        app.post(SUB_ROUTES + '/jwt', [
            login.generateAccessToken
        ]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    includeRoutes
}

const login = require('../controllers/login/login');
const subRoute = '/login';

function includeRoutes(app) {
    try {
        app.get(subRoute + '/test', (req, res) => {
            return res.send('project is running on login routes');
        });
    
        app.post(subRoute + '/jwt', [
            login.generateAccessToken
        ]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    includeRoutes
}

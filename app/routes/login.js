const login = require('../controllers/login/login')

function includeRoutes(app) {
    try {
        const subRoute = '/login';

        app.get(subRoute + '/test', (req, res) => {
            return res.send('project is running');
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

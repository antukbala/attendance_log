const login = require('../controllers/login/login')

function includeRoutes(app) {
    try {
        const subRoute = '/login';

        app.get(subRoute + '/test', (req, res) => {
            return res.send('project is running');
        });
    
        app.get(subRoute + '/jwt', [
            login.insertAttendanceLog
        ]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    includeRoutes
}

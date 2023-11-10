const attendanceLog = require('../controllers/attendance/attendanceLog')

function includeRoutes(app) {
    app.get('/test', (req, res) => {
        return res.send('project is running');
    });

    app.post('/attendance', [
        attendanceLog.insertAttendanceLog
    ]);
}

module.exports = {
    includeRoutes
}

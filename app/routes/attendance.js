const attendanceLog = require('../controllers/attendance/attendanceLog')

function includeRoutes(app) {
    app.get('/test', (req, res) => {
        return res.send('project is running');
    });

    app.get('/attendance', [
        attendanceLog.getAttendanceLog
    ]);

    app.post('/attendance', [
        attendanceLog.insertAttendanceLog
    ]);

    // app.patch('/attendance', [
    //     attendanceLog.insertAttendanceLog
    // ]);
}

module.exports = {
    includeRoutes
}

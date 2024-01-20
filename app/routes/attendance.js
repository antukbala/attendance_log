const attendanceLog = require('../controllers/attendance/attendanceLog')

function includeRoutes(app) {
    try {
        app.get('/test', (req, res) => {
            return res.send('project is running');
        });
    
        app.post('/encrypt', [
            attendanceLog.encrypt
        ]);

        app.post('/decrypt', [
            attendanceLog.decrypt
        ]);
    
        app.get('/attendance', [
            attendanceLog.getAttendanceLog
        ]);
    
        app.post('/attendance', [
            attendanceLog.insertAttendanceLog
        ]);
    
        // app.patch('/attendance', [
        //     attendanceLog.insertAttendanceLog
        // ]);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    includeRoutes
}

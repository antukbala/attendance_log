const DATE = require('../../services/dateTime');
const DISTANCE = require('../../services/distanceCalculation');
const attendanceModel = require('../../models/attendance/attendanceLog');

async function insertAttendanceLog(req, res) {
    try {
        const { user_id, latitude, longitude, log_date, log_time, attendance_type, work_environment } = req.body;
        const values = { userId: user_id, latitude, longitude, logDate: log_date, logTime: log_time, attendanceType: attendance_type, workEnvironment: work_environment };
        const currentDateTime = DATE.getCurrentDateTime();

        if (values.logDate !== 'auto' || values.logTime !== 'auto') {
            values.logDate = (values.logDate === 'auto') ? currentDateTime.date : values.logDate;
            values.logTime = (values.logTime === 'auto') ? currentDateTime.time : values.logTime;
        }

        values.logDateTime = (values.logDate === 'auto' && values.logTime === 'auto') ? `${currentDateTime.date} ${currentDateTime.time}` : `${values.logDate} ${values.logTime}`;
        values.distance = DISTANCE.calculateDistanceByHaversineFormula(process.env.LAT_OFFICE, process.env.LONG_OFFICE, values.latitude, values.longitude, 'm');
        values.status = 'active';

        const attendanceId = await attendanceModel.insertAttendanceLog(values);

        const finalOutput = {
            response_code: 1000,
            attendance_id: attendanceId,
            message: 'attendance saved'
        };

        return res.send(finalOutput);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    insertAttendanceLog
}

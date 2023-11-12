const DATE = require('../../services/dateTime');
const DISTANCE = require('../../services/distanceCalculation');
const attendanceModel = require('../../models/attendance/attendanceLog');
const { CONSTANTS } = require('../../services/constants');

async function insertAttendanceLog(req, res) {
    try {
        const { user_id, latitude, longitude, log_date, log_time, attendance_type, work_environment, additional_details } = req.body;
        const values = { userId: user_id, latitude, longitude, logDate: log_date, logTime: log_time, attendanceType: attendance_type, workEnvironment: work_environment, additionalDetails: additional_details };
        const currentDateTime = DATE.getCurrentDateTime();

        if (values.logDate !== CONSTANTS.LOG_TYPE.AUTO || values.logTime !== CONSTANTS.LOG_TYPE.AUTO) {
            values.logDate = (values.logDate === CONSTANTS.LOG_TYPE.AUTO) ? currentDateTime.date : values.logDate;
            values.logTime = (values.logTime === CONSTANTS.LOG_TYPE.AUTO) ? currentDateTime.time : values.logTime;
        }

        values.logDateTime = (values.logDate === CONSTANTS.LOG_TYPE.AUTO && values.logTime === CONSTANTS.LOG_TYPE.AUTO) ? `${currentDateTime.date} ${currentDateTime.time}` : `${values.logDate} ${values.logTime}`;
        values.distance = DISTANCE.calculateDistanceByHaversineFormula(process.env.LAT_OFFICE, process.env.LONG_OFFICE, values.latitude, values.longitude, 'm');
        values.validity = (values.distance <= CONSTANTS.MAX_VALID_DISTANCE) ? CONSTANTS.VALIDITY.VALID : CONSTANTS.VALIDITY.INVALID;
        values.status = CONSTANTS.STATUS.ACTIVE;

        const attendanceId = await attendanceModel.insertAttendanceLog(values);

        let finalOutput = {
            response_code: CONSTANTS.RESPONSE_CODE.SUCCESS,
            attendance_id: attendanceId,
            message: 'attendance saved'
        };

        if (attendanceId === CONSTANTS.NEGETIVE_VALUE) {
            finalOutput = {
                response_code: CONSTANTS.RESPONSE_CODE.FAIL,
                message: `can't save attendance`
            };
        }

        return res.send(finalOutput);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

async function getAttendanceLog(req, res) {
    try {
        const { user_id, attendance_type, date, status } = req.query;
        const values = { userId: user_id, attendanceType: attendance_type.split(','), date, status };
        const attendance = await attendanceModel.getAttendanceLogByUserIdAndDate(values);
        return res.send(attendance);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    insertAttendanceLog,
    getAttendanceLog
}

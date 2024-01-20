const DATE = require('../../services/dateTime');
const DISTANCE = require('../../services/distanceCalculation');
const attendanceModel = require('../../models/attendance/attendanceLog');
const { CONSTANTS } = require('../../services/constants');
const Helper = require('../../services/helper');
const Encryption = require('../../services/encryption');

async function insertAttendanceLog(req, res) {
    try {
        const { user_id, latitude, longitude, log_date, log_time, attendance_type, work_environment, additional_details } = req.body;
        const values = { userId: user_id, latitude, longitude, logDate: log_date, logTime: log_time, attendanceType: attendance_type, workEnvironment: work_environment, additionalDetails: additional_details };
        const currentDateTime = DATE.getCurrentDateTime();
        let finalOutput = {};

        if (values.logDate !== CONSTANTS.LOG_TYPE.AUTO || values.logTime !== CONSTANTS.LOG_TYPE.AUTO) {
            values.logDate = (values.logDate === CONSTANTS.LOG_TYPE.AUTO) ? currentDateTime.date : values.logDate;
            values.logTime = (values.logTime === CONSTANTS.LOG_TYPE.AUTO) ? currentDateTime.time : values.logTime;
        }

        values.logDateTime = (values.logDate === CONSTANTS.LOG_TYPE.AUTO && values.logTime === CONSTANTS.LOG_TYPE.AUTO) ? `${currentDateTime.date} ${currentDateTime.time}` : `${values.logDate} ${values.logTime}`;
        
        const officeDetails = await attendanceModel.getAttendanceSetupOfOfficeByUserId(values.userId);
        values.distance = DISTANCE.calculateDistanceByHaversineFormula(officeDetails.latitude, officeDetails.longitude, values.latitude, values.longitude, 'm');
        values.attendanceStatus = getAttendanceStatus(
            officeDetails.allowed_distance,
            (values.attendanceType === CONSTANTS.ATTENDANCE_TYPE.IN) ? officeDetails.check_in_time : officeDetails.check_out_time,
            officeDetails.time_flexibility,
            values.distance,
            values.logTime,
            values.attendanceType
        );
        values.commentOnAttendanceStatus = (values.attendanceStatus === CONSTANTS.ATTENDANCE_STATUS.APPROVED) ? CONSTANTS.COMMENT_ON_ATTENDANCE_STATUS.AUTO_APPROVED : CONSTANTS.COMMENT_ON_ATTENDANCE_STATUS.DISTANCE_OR_TIME_ISSUE;
       
        values.attendanceId = await attendanceModel.insertAttendanceLogOnAttendanceLogTable(values);
        if (values.attendanceId === CONSTANTS.NEGETIVE_VALUE) { return res.send(Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAILED_CASES, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE)); };
        
        const attendanceStatusId = await attendanceModel.insertAttendanceOnAttendanceStatusTable(values.attendanceId, values.attendanceStatus, values.commentOnAttendanceStatus);
        if (attendanceStatusId === CONSTANTS.NEGETIVE_VALUE) { return res.send(Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAILED_CASES, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE)); };

        finalOutput = Helper.generateResponse(CONSTANTS.RESPONSE_CODE.SUCCESS, CONSTANTS.MESSAGE.SAVED_ATTENDANCE, ['attendance_id', 'attendance_status'], [values.attendanceId, values.attendanceStatus]);
        if (values.attendanceId === CONSTANTS.NEGETIVE_VALUE) {
            finalOutput = Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAIL, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE);
        }

        return res.send(finalOutput);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    insertAttendanceLog
}

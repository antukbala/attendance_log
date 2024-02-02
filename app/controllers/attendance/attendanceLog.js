const DATE = require('../../services/dateTime');
const DISTANCE = require('../../services/distanceCalculation');
const attendanceModel = require('../../models/attendance/attendanceLog');
const { CONSTANTS } = require('../../services/constants');
const Helper = require('../../services/helper');
const Encryption = require('../../services/encryption');

function timeStringToMilliSeconds(timeString) {
    try {
        const [ hours, minutes, seconds ] = timeString.split(':');
        const milliSeconds = ((Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds)) * 1000;
        return milliSeconds;
    } catch (error) {
        throw error;
    }
}

function getDateTimeFromMilliSeconds(milliSeconds) {
    try {
        const dateObject = new Date();
        dateObject.setHours(0, 0, 0, milliSeconds);
        return dateObject;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function getAttendanceStatus(maxAllowedDistance, attendanceTime, maxAllowedTime, userDistance, userTime, attendanceType) {
    try {
        let attendanceStatus = CONSTANTS.ATTENDANCE_STATUS.PENDING;
        const attendanceTimeInMilliSeconds = timeStringToMilliSeconds(attendanceTime);
        const maxAllowedTimeInMilliSeconds = timeStringToMilliSeconds(maxAllowedTime);
        const userAttendanceTimeInMilliSeconds = timeStringToMilliSeconds(userTime);
        const userAttendanceTime = getDateTimeFromMilliSeconds(userAttendanceTimeInMilliSeconds);

        switch (attendanceType) {
            case CONSTANTS.ATTENDANCE_TYPE.IN:
                if (userDistance <= maxAllowedDistance) {
                    maxAllowedTime = getDateTimeFromMilliSeconds(attendanceTimeInMilliSeconds + maxAllowedTimeInMilliSeconds);
                    if (userAttendanceTime <= maxAllowedTime) {
                        attendanceStatus = CONSTANTS.ATTENDANCE_STATUS.APPROVED;
                    }
                }
                break;
            
            case CONSTANTS.ATTENDANCE_TYPE.OUT:
                if (userDistance <= maxAllowedDistance) {
                    maxAllowedTime = getDateTimeFromMilliSeconds(attendanceTimeInMilliSeconds - maxAllowedTimeInMilliSeconds);
                    if (userAttendanceTime >= maxAllowedTime) {
                        attendanceStatus = CONSTANTS.ATTENDANCE_STATUS.APPROVED;
                    }
                }
                break;
        }

        return attendanceStatus;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

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

async function getAttendanceLog(req, res) {
    try {
        const { user_id, attendance_type, start_date, end_date, attendance_status } = req.query;
        const values = { userId: user_id, attendanceType: attendance_type.split(','), startDate: start_date, endDate: end_date, attendanceStatus: attendance_status.split(',') };
        const attendance = await attendanceModel.getAttendanceLogByUserIdAndDate(values.userId, values.startDate, values.endDate, values.attendanceType, values.attendanceStatus);
        if (attendance === null) {
            return res.send({ status: 1000, message: 'no attendace found' });
        }
        return res.send({ status: 1000, attendance_list: attendance });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

function encrypt(req, res) {
    try {
        let object = req.body.object;
        const encryptedObject = Encryption.encryptWithAES256(object);
        const values = { object: object, encrypted_object: encryptedObject };
        return res.send(values);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

function decrypt(req, res) {
    try {
        const object = req.body.payload;
        // object.status = 1000;
        let decryptedObject = Encryption.decryptWithAES256(object);
        // decryptedObject = JSON.parse(decryptedObject);
        const values = { object: object, decrypted_object: decryptedObject };
        return res.send(values);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    insertAttendanceLog,
    getAttendanceLog,
    encrypt,
    decrypt
}

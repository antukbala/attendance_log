const DATE = require('../../services/dateTime');
const DISTANCE = require('../../services/distanceCalculation');
const officeDetailsModel = require('../../models/office/officeDetails');
const { CONSTANTS } = require('../../services/constants');
const Helper = require('../../services/helper');
const Encryption = require('../../services/encryption');

async function addOffice(req, res) {
    try {
        const body = req.body;
        let values = {};
        values.officeName = body.office_name;
        values.officeDetails = body.office_details;
        values.officeDetails.forEach((office) => {
            office.allowedDistance = office.allowed_distance;
            office.checkinTime = office.check_in_time;
            office.checkoutTime = office.check_out_time;
            office.timeFlexibility = office.time_flexibility;
            office.superAdmin = office.super_admin;
            office.departments.forEach((department) => {
                department.departmentName = department.department_name;
                department.jobTitles = department.job_titles;
                delete department.department_name;
                delete department.job_titles;
            })

            delete office.allowed_distance;
            delete office.check_in_time;
            delete office.check_out_time;
            delete office.time_flexibility;
            delete office.super_admin;
        });

        return res.send({t: values})

        const officeId = await officeDetailsModel.inertOfficeOnOfficeList(values.officeName);
        if ([-1, undefined, null].includes(officeId)) {
            return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['message'], ['office not inserted']));
        }

        values.officeId = officeId;
        values.officeDetailsId = [];
        for (let i = 0; i < values.officeDetails.length; i++) {
            const officeDetails = values.officeDetails[i];
            const officeDetailsId = await officeDetailsModel.insertOfficeDetails(
                values.officeId, officeDetails.address, 
            );
        };

        return res.send(values);
        // const { user_id, latitude, longitude, log_date, log_time, attendance_type, work_environment, additional_details } = req.body;
        // const values = { userId: user_id, latitude, longitude, logDate: log_date, logTime: log_time, attendanceType: attendance_type, workEnvironment: work_environment, additionalDetails: additional_details };
        // const currentDateTime = DATE.getCurrentDateTime();
        // let finalOutput = {};

        // if (values.logDate !== CONSTANTS.LOG_TYPE.AUTO || values.logTime !== CONSTANTS.LOG_TYPE.AUTO) {
        //     values.logDate = (values.logDate === CONSTANTS.LOG_TYPE.AUTO) ? currentDateTime.date : values.logDate;
        //     values.logTime = (values.logTime === CONSTANTS.LOG_TYPE.AUTO) ? currentDateTime.time : values.logTime;
        // }

        // values.logDateTime = (values.logDate === CONSTANTS.LOG_TYPE.AUTO && values.logTime === CONSTANTS.LOG_TYPE.AUTO) ? `${currentDateTime.date} ${currentDateTime.time}` : `${values.logDate} ${values.logTime}`;
        
        // const officeDetails = await attendanceModel.getAttendanceSetupOfOfficeByUserId(values.userId);
        // values.distance = DISTANCE.calculateDistanceByHaversineFormula(officeDetails.latitude, officeDetails.longitude, values.latitude, values.longitude, 'm');
        // values.attendanceStatus = getAttendanceStatus(
        //     officeDetails.allowed_distance,
        //     (values.attendanceType === CONSTANTS.ATTENDANCE_TYPE.IN) ? officeDetails.check_in_time : officeDetails.check_out_time,
        //     officeDetails.time_flexibility,
        //     values.distance,
        //     values.logTime,
        //     values.attendanceType
        // );
        // values.commentOnAttendanceStatus = (values.attendanceStatus === CONSTANTS.ATTENDANCE_STATUS.APPROVED) ? CONSTANTS.COMMENT_ON_ATTENDANCE_STATUS.AUTO_APPROVED : CONSTANTS.COMMENT_ON_ATTENDANCE_STATUS.DISTANCE_OR_TIME_ISSUE;
       
        // values.attendanceId = await attendanceModel.insertAttendanceLogOnAttendanceLogTable(values);
        // if (values.attendanceId === CONSTANTS.NEGETIVE_VALUE) { return res.send(Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAILED_CASES, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE)); };
        
        // const attendanceStatusId = await attendanceModel.insertAttendanceOnAttendanceStatusTable(values.attendanceId, values.attendanceStatus, values.commentOnAttendanceStatus);
        // if (attendanceStatusId === CONSTANTS.NEGETIVE_VALUE) { return res.send(Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAILED_CASES, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE)); };

        // finalOutput = Helper.generateResponse(CONSTANTS.RESPONSE_CODE.SUCCESS, CONSTANTS.MESSAGE.SAVED_ATTENDANCE, ['attendance_id', 'attendance_status'], [values.attendanceId, values.attendanceStatus]);
        // if (values.attendanceId === CONSTANTS.NEGETIVE_VALUE) {
        //     finalOutput = Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAIL, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE);
        // }

        // return res.send(finalOutput);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    addOffice
}
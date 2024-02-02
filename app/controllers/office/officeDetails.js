const DATE = require('../../services/dateTime');
const DISTANCE = require('../../services/distanceCalculation');
const officeDetailsModel = require('../../models/office/officeDetails');
const superAdminModel = require('../../models/office/superAdmin');
const officeDepartmentModel = require('../../models/office/officeDepartment');
const jobRoleModel = require('../../models/office/jobRole');
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
            office.officeBranchName = office.office_branch_name;
            office.allowedDistance = office.allowed_distance;
            office.checkinTime = office.checkin_time;
            office.checkoutTime = office.checkout_time;
            office.timeFlexibility = office.time_flexibility;
            office.superAdmin = office.super_admin;
            
            if (office.hasOwnProperty('departments') && office.departments.length !== 0) {
                office.departments.forEach((department) => {
                    department.departmentName = department.department_name;
                    department.jobTitles = department.job_titles;
                    delete department.department_name;
                    delete department.job_titles;
                });
            }

            delete office.allowed_distance;
            delete office.checkin_time;
            delete office.checkout_time;
            delete office.time_flexibility;
            delete office.super_admin;
        });

        // return res.send({t: values});

        const officeId = await officeDetailsModel.inertOfficeOnOfficeList(values.officeName);
        if ([0, -1, undefined, null].includes(officeId)) {
            return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['message'], ['office not inserted']));
        }

        values.officeId = officeId;

        // const officeDetailsIds = await officeDetailsModel.inertOfficeOnOfficeList(values.officeId);
        let officeAddingDetails = [], superAdminAddingDetails = [], departmentAddingDetails = [];
        for (let i = 0; i < values.officeDetails.length; i++) {
            let newOfficeAddingDetails = {};
            const officeDetails = values.officeDetails[i];
            const paramsForOfficeDetailsAdd = { officeId: values.officeId, officeBranchName: officeDetails.officeBranchName, address: officeDetails.address,
                latitude: officeDetails.latitude, longitude: officeDetails.longitude, allowedDistance: officeDetails.allowedDistance, checkinTime: officeDetails.checkinTime,
                checkoutTime: officeDetails.checkoutTime, timeFelxibility: officeDetails.timeFelxibility };
            const officeDetailsId = await officeDetailsModel.insertOfficeOnOfficeDetails(paramsForOfficeDetailsAdd);

            if ([0, -1, undefined, null].includes(officeDetailsId)) {
                newOfficeAddingDetails.message = `failed to insert office details`;
                newOfficeAddingDetails.office_id = officeId;
                newOfficeAddingDetails.office_branch_name = officeDetails.officeBranchName;
                officeAddingDetails.push(newOfficeAddingDetails);
                continue;
            }

            newOfficeAddingDetails.office_details_id = officeDetailsId;

            if (officeDetails.hasOwnProperty('superAdmin') && officeDetails.superAdmin.length > 0) {
                for (let j = 0; j < officeDetails.superAdmin.length; j++) {
                    const superAdminDetails = officeDetails.superAdmin[j];
                    let newSuperAdminAddingDetails = {};
                    const superAdminId = await superAdminModel.insertSuperAdminForOffice(officeId, officeDetailsId, superAdminDetails.name, superAdminDetails.phone);

                    if ([0, -1, undefined, null].includes(officeDetailsId)) {
                        newSuperAdminAddingDetails.message = `failed to insert super admin details`;
                        newSuperAdminAddingDetails.super_admin_name = superAdminDetails.name;
                        superAdminAddingDetails.push(newSuperAdminAddingDetails);
                        continue;
                    }

                    newSuperAdminAddingDetails.super_admin_id = superAdminId;
                    newSuperAdminAddingDetails.super_admin_name = superAdminDetails.name;
                    superAdminAddingDetails.push(newSuperAdminAddingDetails);
                }
            }

            if (officeDetails.hasOwnProperty('departments') && officeDetails.departments.length > 0) {
                for (let k = 0; k < officeDetails.departments.length; k++) {
                    const departmentDetails = officeDetails.superAdmin[k];
                    let newDepartmentAddingDetails = {}, jobTitleAddingDetails = [];
                    const departmentId = await officeDepartmentModel.insertDepartmentOfOffice(officeId, officeDetailsId, departmentDetails.departmentName);

                    if ([0, -1, undefined, null].includes(departmentId)) {
                        newDepartmentAddingDetails.message = `failed to insert department`;
                        newDepartmentAddingDetails.department_name = departmentDetails.departmentName;
                        superAdminAddingDetails.push(newDepartmentAddingDetails);
                        continue;
                    }

                    newDepartmentAddingDetails.department_id = departmentId;
                    newDepartmentAddingDetails.department_name = departmentDetails.departmentName;

                    if (departmentDetails.hasOwnProperty('jobTitles') && departmentDetails.jobTitles.length > 0) {
                        for (let x = 0; x < departmentDetails.jobTitles.length; x++) {
                            const jobTitle = departmentDetails.jobTitls[x];
                            let newJobTitleAddingDetails = {};
                            const jobRoleId = await jobRoleModel.insertJobRoleOfDepartment(departmentId, jobTitle, null);

                            if ([0, -1, undefined, null].includes(jobRoleId)) {
                                newJobTitleAddingDetails.message = `failed to insert job role`;
                                newJobTitleAddingDetails.job_title = jobTitle;
                                jobTitleAddingDetails.push(newJobTitleAddingDetails);
                                continue;
                            }
                            
                            newJobTitleAddingDetails.job_title = jobTitle;
                            newJobTitleAddingDetails.job_role_id = jobRoleId;
                            jobTitleAddingDetails.push(newJobTitleAddingDetails);
                        }
                    }

                    if (jobTitleAddingDetails.length > 0) {
                        newDepartmentAddingDetails.job_roles = jobTitleAddingDetails;
                    }
                    departmentAddingDetails.push(newDepartmentAddingDetails);
                }
            }
        };

        const finalOutput = {
            status: 1000,
            office: officeAddingDetails,
            super_admin: superAdminAddingDetails,
            department: departmentAddingDetails
        }

        return res.send(finalOutput);
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

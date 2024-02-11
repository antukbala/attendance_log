const DATE = require('../../services/dateTime');
const DISTANCE = require('../../services/distanceCalculation');
const officeDetailsModel = require('../../models/office/officeDetails');
const superAdminModel = require('../../models/office/superAdmin');
const officeDepartmentModel = require('../../models/office/officeDepartment');
const jobRoleModel = require('../../models/office/jobRole');
const { CONSTANTS } = require('../../services/constants');
const Helper = require('../../services/helper');
const Encryption = require('../../services/encryption');

async function addDepartment(req, res) {
    try {
        const body = req.body;
        let values = {
            companyId: body.company_id,
            departmentName: body.department_name
        };

        const departmentId = await officeDepartmentModel.insertDepartmentOfOffice(values.companyId, values.departmentName);
        if (departmentId === null) {
            return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['status', 'message'], [2000, 'could not insert department']));
        }
        
        const response = {
            company_id: values.companyId,
            department_id: departmentId,
            department_name: values.departmentName
        };
        return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['status', 'message', 'data'], [1000, 'added department', response]));
    } catch (error) {
        return res.send(error);
    }
}

async function addOffice(req, res) {
    try {
        const body = req.body;
        let values = {
            companyId: body.company_id,
            officeName: body.office_name,
            address: body.address,
            latitude: body.latitude,
            longitude: body.longitude,
            allowedDistance: body.allowed_distance,
            checkinTime: body.checkin_time,
            checkoutTime: body.checkout_time,
            timeFlexibility: body.time_flexibility
        };

        const officeId = await officeDetailsModel.insertNewOfficeForCompany(values);
        if ([0, -1, undefined, null].includes(officeId)) {
            return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['message'], ['office not added']));
        }

        const response = {
            company_id: values.companyId,
            office_id: officeId
        };
        
        return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['status', 'message', 'data'], [1000, 'office added', response]));
    } catch (error) {
        return res.send(error);
    }
}

async function addCompany(req, res) {
    try {
        const body = req.body;
        let values = {};

        values.companyName = body.company_name;
        values.superAdmin = body.super_admin;

        const companyId = await officeDetailsModel.inertCompanyOnOfficeList(values.companyName);
        if ([0, -1, undefined, null].includes(companyId)) {
            return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['message'], ['company not added']));
        }

        const paramsForSuperAdminAdd = {
            officeId: companyId, name: values.superAdmin.name, phone: values.superAdmin.phone,
            email: values.superAdmin.email, adminType: values.superAdmin.type
        };
        const superAdminId = await superAdminModel.insertSuperAdminForOffice(paramsForSuperAdminAdd);

        if ([0, -1, undefined, null].includes(superAdminId)) {
            const response = {
                company_id: companyId,
                super_admin_id: null
            };
            return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['status', 'message', 'data'], [1001, 'company added but could not add super admin', response]));
        }
        
        const response = {
            company_id: companyId,
            company_name: values.companyName,
            super_admin: {
                id: superAdminId,
                name: values.superAdmin.name,
                email: values.superAdmin.email,
                phone: values.superAdmin.phone,
                type: values.superAdmin.type
            }
        };
        
        return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['status', 'message', 'data'], [1000, 'company added with super admin', response]));
    } catch (error) {
        return res.send(error);
    }
}

// async function addOffice(req, res) {
//     try {
//         const body = req.body;
//         let values = {};
//         values.officeName = body.office_name;
//         values.superAdmin = body.super_admin;
//         values.officeDetails = body.office_details;
//         values.officeDetails.forEach((office) => {
//             office.officeBranchName = office.office_branch_name;
//             office.allowedDistance = office.allowed_distance;
//             office.checkinTime = office.checkin_time;
//             office.checkoutTime = office.checkout_time;
//             office.timeFlexibility = office.time_flexibility;
            
//             if (office.hasOwnProperty('departments') && office.departments.length !== 0) {
//                 office.departments.forEach((department) => {
//                     department.departmentName = department.department_name;
//                     department.jobTitles = department.job_titles;
//                     delete department.department_name;
//                     delete department.job_titles;
//                 });
//             }

//             delete office.office_branch_name;
//             delete office.allowed_distance;
//             delete office.checkin_time;
//             delete office.checkout_time;
//             delete office.time_flexibility;
//         });

//         const officeId = await officeDetailsModel.inertOfficeOnOfficeList(values.officeName);
//         if ([0, -1, undefined, null].includes(officeId)) {
//             return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['message'], ['office not inserted']));
//         }

//         values.officeId = officeId;
//         const paramsForSuperAdminAdd = {
//             officeId: values.officeId, name: values.superAdmin.name, phone: values.superAdmin.phone,
//             email: values.superAdmin.email, adminType: values.superAdmin.type
//         };
//         const superAdminId = await superAdminModel.insertSuperAdminForOffice(paramsForSuperAdminAdd);

//         if ([0, -1, undefined, null].includes(superAdminId)) {
//             values.superAdmin.id = null,
//             values.superAdmin.name,
//             values.superAdmin.email,
//             values.superAdmin.type
//             return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['message'], ['office not inserted']));
//         }
//         values.superAdmin.id = superAdminId;

//         let officeAddingDetails = [];
//         for (let i = 0; i < values.officeDetails.length; i++) {
//             let newOfficeAddingDetails = {};
//             const officeDetails = values.officeDetails[i];
//             const paramsForOfficeDetailsAdd = { officeId: values.officeId, officeBranchName: officeDetails.officeBranchName, address: officeDetails.address,
//                 latitude: officeDetails.latitude, longitude: officeDetails.longitude, allowedDistance: officeDetails.allowedDistance, checkinTime: officeDetails.checkinTime,
//                 checkoutTime: officeDetails.checkoutTime, timeFlexibility: officeDetails.timeFlexibility };
//             const officeDetailsId = await officeDetailsModel.insertOfficeOnOfficeDetails(paramsForOfficeDetailsAdd);

//             if ([0, -1, undefined, null].includes(officeDetailsId)) {
//                 newOfficeAddingDetails.message = `failed to insert office details`;
//                 newOfficeAddingDetails.office_id = officeId;
//                 newOfficeAddingDetails.office_branch_name = officeDetails.officeBranchName;
//                 officeAddingDetails.push(newOfficeAddingDetails);
//                 continue;
//             }

//             newOfficeAddingDetails.office_details_id = officeDetailsId;
//             newOfficeAddingDetails.office_branch_name = officeDetails.officeBranchName;

//             if (officeDetails.hasOwnProperty('departments') && officeDetails.departments.length > 0) {
//                 let departmentAddingDetails = [];

//                 for (let k = 0; k < officeDetails.departments.length; k++) {
//                     const departmentDetails = officeDetails.departments[k];
//                     let newDepartmentAddingDetails = {};
//                     const departmentId = await officeDepartmentModel.insertDepartmentOfOffice(officeId, officeDetailsId, departmentDetails.departmentName);

//                     if ([0, -1, undefined, null].includes(departmentId)) {
//                         newDepartmentAddingDetails.message = `failed to insert department`;
//                         newDepartmentAddingDetails.department_name = departmentDetails.departmentName;
//                         superAdminAddingDetails.push(newDepartmentAddingDetails);
//                         continue;
//                     }

//                     newDepartmentAddingDetails.department_id = departmentId;
//                     newDepartmentAddingDetails.department_name = departmentDetails.departmentName;

//                     if (departmentDetails.hasOwnProperty('jobTitles') && departmentDetails.jobTitles.length > 0) {
//                         let jobTitleAddingDetails = [];

//                         for (let x = 0; x < departmentDetails.jobTitles.length; x++) {
//                             const jobTitle = departmentDetails.jobTitles[x];
//                             let newJobTitleAddingDetails = {};
//                             const jobRoleId = await jobRoleModel.insertJobRoleOfDepartment(departmentId, jobTitle, null);

//                             if ([0, -1, undefined, null].includes(jobRoleId)) {
//                                 newJobTitleAddingDetails.message = `failed to insert job role`;
//                                 newJobTitleAddingDetails.job_title = jobTitle;
//                                 jobTitleAddingDetails.push(newJobTitleAddingDetails);
//                                 continue;
//                             }
                            
//                             newJobTitleAddingDetails.job_title = jobTitle;
//                             newJobTitleAddingDetails.job_role_id = jobRoleId;
//                             jobTitleAddingDetails.push(newJobTitleAddingDetails);
//                         }

//                         if (jobTitleAddingDetails.length > 0) newDepartmentAddingDetails.job_roles = jobTitleAddingDetails;
//                     }

//                     departmentAddingDetails.push(newDepartmentAddingDetails);
//                 }
//                 if (departmentAddingDetails.length > 0) newOfficeAddingDetails.departments = departmentAddingDetails;
//             }

//             officeAddingDetails.push(newOfficeAddingDetails);
//         }

//         const finalOutput = {
//             status: 1000,
//             data: {
//                 office_id: values.officeId,
//                 super_admin: {
//                     id: values.superAdmin.id,
//                     name: values.superAdmin.name,
//                     email: values.superAdmin.email,
//                     type: values.superAdmin.type
//                 },
//                 office_details: officeAddingDetails
//             }
//         };

//         return res.json(finalOutput);
//         // const { user_id, latitude, longitude, log_date, log_time, attendance_type, work_environment, additional_details } = req.body;
//         // const values = { userId: user_id, latitude, longitude, logDate: log_date, logTime: log_time, attendanceType: attendance_type, workEnvironment: work_environment, additionalDetails: additional_details };
//         // const currentDateTime = DATE.getCurrentDateTime();
//         // let finalOutput = {};

//         // if (values.logDate !== CONSTANTS.LOG_TYPE.AUTO || values.logTime !== CONSTANTS.LOG_TYPE.AUTO) {
//         //     values.logDate = (values.logDate === CONSTANTS.LOG_TYPE.AUTO) ? currentDateTime.date : values.logDate;
//         //     values.logTime = (values.logTime === CONSTANTS.LOG_TYPE.AUTO) ? currentDateTime.time : values.logTime;
//         // }

//         // values.logDateTime = (values.logDate === CONSTANTS.LOG_TYPE.AUTO && values.logTime === CONSTANTS.LOG_TYPE.AUTO) ? `${currentDateTime.date} ${currentDateTime.time}` : `${values.logDate} ${values.logTime}`;
        
//         // const officeDetails = await attendanceModel.getAttendanceSetupOfOfficeByUserId(values.userId);
//         // values.distance = DISTANCE.calculateDistanceByHaversineFormula(officeDetails.latitude, officeDetails.longitude, values.latitude, values.longitude, 'm');
//         // values.attendanceStatus = getAttendanceStatus(
//         //     officeDetails.allowed_distance,
//         //     (values.attendanceType === CONSTANTS.ATTENDANCE_TYPE.IN) ? officeDetails.check_in_time : officeDetails.check_out_time,
//         //     officeDetails.time_flexibility,
//         //     values.distance,
//         //     values.logTime,
//         //     values.attendanceType
//         // );
//         // values.commentOnAttendanceStatus = (values.attendanceStatus === CONSTANTS.ATTENDANCE_STATUS.APPROVED) ? CONSTANTS.COMMENT_ON_ATTENDANCE_STATUS.AUTO_APPROVED : CONSTANTS.COMMENT_ON_ATTENDANCE_STATUS.DISTANCE_OR_TIME_ISSUE;
       
//         // values.attendanceId = await attendanceModel.insertAttendanceLogOnAttendanceLogTable(values);
//         // if (values.attendanceId === CONSTANTS.NEGETIVE_VALUE) { return res.send(Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAILED_CASES, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE)); };
        
//         // const attendanceStatusId = await attendanceModel.insertAttendanceOnAttendanceStatusTable(values.attendanceId, values.attendanceStatus, values.commentOnAttendanceStatus);
//         // if (attendanceStatusId === CONSTANTS.NEGETIVE_VALUE) { return res.send(Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAILED_CASES, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE)); };

//         // finalOutput = Helper.generateResponse(CONSTANTS.RESPONSE_CODE.SUCCESS, CONSTANTS.MESSAGE.SAVED_ATTENDANCE, ['attendance_id', 'attendance_status'], [values.attendanceId, values.attendanceStatus]);
//         // if (values.attendanceId === CONSTANTS.NEGETIVE_VALUE) {
//         //     finalOutput = Helper.generateResponse(CONSTANTS.RESPONSE_CODE.FAIL, CONSTANTS.MESSAGE.CANT_SAVE_ATTENDANCE);
//         // }

//         // return res.send(finalOutput);
//     } catch (error) {
//         console.log(error);
//         res.send(error);
//     }
// }

async function getAllCompany(req, res) {
    try {
        const companyList = await officeDetailsModel.getAllCompanyDetails();
        return res.send(CONSTANTS.FINAL_RESPONSE.MAKE_CUSTOM_RESPONSE(['status', 'message', 'data'], [1000, 'all company list', companyList]));
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    addCompany,
    addOffice,
    addDepartment,
    getAllCompany
}

const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');

async function insertJobRoleOfDepartment(departmentId, jobTitle, jobDescription) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.JobRole.InsertJobRoleOfDepartment;
            let params = [ departmentId, jobTitle, jobDescription, 'active' ];
            const jobRole = await DB.doQuery(connection, query, params);
            return jobRole.hasOwnProperty('insertId') ? jobRole.insertId : -1;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// async function getAttendanceSetupOfOfficeByUserId(userId) {
//     try {
//         let connection = await DB.dbConnection();
//         try {
//             let query = SQL.Attendance.GetAttendanceSetupOfOffice;
//             let params = [ userId, 'active', 'active', 'active', 'active' ];
//             const officeDetails = await DB.doQuery(connection, query, params);
//             return (officeDetails.length === 0) ? null : JSON.parse(JSON.stringify(officeDetails[0]));
//         } finally {
//             connection.release();
//         }
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

module.exports = {
    insertJobRoleOfDepartment
}

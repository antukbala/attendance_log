const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');

async function insertDepartmentOfOffice(officeId, departmentName) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.OfficeDepartment.InsertDepartmentDetails;
            let params = [ officeId, departmentName, 'active' ];
            const department = await DB.doQuery(connection, query, params);
            return department.hasOwnProperty('insertId') ? department.insertId : -1;
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
    insertDepartmentOfOffice
}

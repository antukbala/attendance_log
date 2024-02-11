const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');

async function insertEmployeeForOffice(args) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Employee.InsertEmployeeDetails;
            let params = [ args.officeId, args.name, args.phone, args.email, args.designationId, 'active' ];
            const employee = await DB.doQuery(connection, query, params);
            return employee.hasOwnProperty('insertId') ? employee.insertId : -1;
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
    insertEmployeeForOffice
}

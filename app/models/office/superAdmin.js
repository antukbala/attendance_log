const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');

async function insertSuperAdminForOffice(officeId, officeDetailsId, name, phone) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.SuperAdmin.InsertSuperAdminForOffice;
            let params = [ officeId, officeDetailsId, name, phone, 'active' ];
            const superAdmin = await DB.doQuery(connection, query, params);
            return superAdmin.hasOwnProperty('insertId') ? superAdmin.insertId : -1;
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
    insertSuperAdminForOffice
}

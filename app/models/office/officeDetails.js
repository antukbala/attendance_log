const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');

async function inertOfficeOnOfficeList(officeName) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Office.InsertOfficeNameOnOfficeList;
            let params = [ officeName, 'active' ];
            const office = await DB.doQuery(connection, query, params);
            return office.hasOwnProperty('insertId') ? office.insertId : -1;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function insertOfficeDetails(officeId, address, latitude, longitude, allowedDistance, checkinTime, checkoutTime) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Office.InsertOfficeDetailsOnOfficeDetails;
            let params = [ officeId, address, latitude, longitude, allowedDistance, checkinTime, checkoutTime ];
            const office = await DB.doQuery(connection, query, params);
            return office.hasOwnProperty('insertId') ? office.insertId : -1;
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
    inertOfficeOnOfficeList,
    insertOfficeDetails
}

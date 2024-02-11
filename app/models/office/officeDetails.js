const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');

async function inertCompanyOnOfficeList(officeName) {
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

async function getAllCompanyDetails() {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Office.GetAllOfficeDetails;
            let params = [];
            const office = await DB.doQuery(connection, query, params);
            return (office.length === 0) ? null : office;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

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

async function insertOfficeOnOfficeDetails(args) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Office.InsertOfficeDetailsOnOfficeDetails;
            let params = [ args.officeId, args.officeBranchName, args.address, args.latitude, args.longitude,
                args.allowedDistance, args.checkinTime, args.checkoutTime, args.timeFlexibility, 'active' ];
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
    insertOfficeOnOfficeDetails,
    inertCompanyOnOfficeList,
    getAllCompanyDetails
}

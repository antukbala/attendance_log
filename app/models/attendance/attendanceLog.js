const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');

async function insertAttendanceLog(values) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Attendance.insertAttendance;
            let params = [ values.userId, values.attendanceType, values.workEnvironment, values.logDateTime,
            values.latitude, values.longitude, values.distance, values.status ];

            if (values.additionalDetails !== 'n/a') {
                query = `${query.slice(0, -1)}, additional_details = ?;`;
                params.push(values.additionalDetails);
            }

            const attendance = await DB.doQuery(connection, query, params);
            return attendance.hasOwnProperty('insertId') ? attendance.insertId : -1;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    insertAttendanceLog
}

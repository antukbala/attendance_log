const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');

async function insertAttendanceLog(values) {
    try {
        let connection = await DB.dbConnection();
        try {
            const query = SQL.Attendance.insertAttendance;
            const params = [ values.userId, values.attendanceType, values.workEnvironment, values.logDateTime,
            values.latitude, values.longitude, values.distance, values.status ];
            const attendance = await DB.doQuery(connection, query, params);
            return Object(attendance).hasOwnProperty('insertId') ? attendance.insertId : -1;
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

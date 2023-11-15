const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');
const { CONSTANTS } = require('../../services/constants');

async function insertAttendanceLogOnAttendanceLogTable(values) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Attendance.InsertAttendanceOnAttendanceLogTable;
            let params = [ values.userId, values.attendanceType, values.workEnvironment, values.logDateTime,
            values.latitude, values.longitude, values.distance, values.additionalDetails ];
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

async function insertAttendanceOnAttendanceStatusTable(attendanceId, status) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Attendance.InsertAttendanceOnAttendanceStatusTable;
            let params = [ attendanceId, status ];
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

async function getAttendanceLogByUserIdAndDate(userId, date, attendanceType) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Attendance.GetAttendanceLogByUserIdAndDate;
            let params = [ userId, date ];

            if (attendanceType.includes(CONSTANTS.NA) === false) {
                query = `${query.slice(0, -1)} and attendance_type in (`;
                attendanceType.forEach(element => {
                    query = query + '?,'
                    params.push(element);
                });
                query = `${query.slice(0, -1)});`;
            }

            const attendance = await DB.doQuery(connection, query, params);
            return (attendance.length === 0) ? null : attendance;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getAttendanceSetupOfOfficeByUserId(userId) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Attendance.GetAttendanceSetupOfOffice;
            let params = [ userId, 'active', 'active', 'active', 'active' ];
            const officeDetails = await DB.doQuery(connection, query, params);
            return (officeDetails.length === 0) ? null : officeDetails;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    insertAttendanceLogOnAttendanceLogTable,
    insertAttendanceOnAttendanceStatusTable,
    getAttendanceLogByUserIdAndDate,
    getAttendanceSetupOfOfficeByUserId
}

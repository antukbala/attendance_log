const DB = require('../../../libs/dbConnect/mysql/attendanceDB');
const SQL = require('../sqlQueries');
const { CONSTANTS } = require('../../services/constants');

async function getUserDataForLogin(email) {
    try {
        let connection = await DB.dbConnection();
        try {
            let query = SQL.Login.GetUserDataForLogin;
            let params = [ email, 'active', 'active', 'active' ];
            const user = await DB.doQuery(connection, query, params);
            return (user.length === 0) ? null : user[0];
        } finally {
            connection.release();
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    getUserDataForLogin
}

const mysql = require('mysql');

const DBOptions = {
    host: process.env.ATTENDANCE_DB_HOST,
    port: process.env.ATTENDANCE_DB_PORT,
    user: process.env.ATTENDANCE_DB_USERNAME,
    password: process.env.ATTENDANCE_DB_PASSWORD,
    database: process.env.ATTENDANCE_DB_DATABASE,
    dialect: process.env.ATTENDANCE_DB_DIALECT,
    connectionLimit: 100,
    pool: {
        min: 10,
        max: 100
    }
};

var tlSaaSDBConn = mysql.createPool(
    {
        host: DBOptions.host,
        user: DBOptions.user,
        password: DBOptions.password,
        database: DBOptions.database,
        dialect: DBOptions.dialect,
        timezone: "Asia/Dhaka",
        define: { timestamps: false, charset: "utf8", dialectOptions: { collate: "utf8_general_ci" } },
        connectionLimit: 100,
        pool: {
            max: 100,
            min: 10,
            acquire: 30000
        },
    });

const dbConnection = () => {
    return new Promise((resolve, reject) => {
        tlSaaSDBConn.getConnection(function (err, con) {
            if(err) {
                reject(err.sqlMessage);
                return;
            }
            resolve(con)
        });
    });
}

const doQuery = (con, sql, args) => {
    return new Promise(function(resolve, reject) {
        const executedQuery = con.query(sql, args, function(err, result) {
            console.log({SQL: executedQuery.sql});
            if(err) return reject(err)
            resolve(result)
        })
    })
}

const isConnectionEstablished = async () => { 
    try {
        const conn = await dbConnection();
        try {
            console.log('successfully connected to attendance_db local for the host:',DBOptions.host);
        } finally {
            conn.release();
        }
    } catch(err) {
        console.log('Connection to attendance_db local was unsuccessful => ', err, 'for the host: ',DBOptions.host);
    }
};

isConnectionEstablished();

module.exports = {
    dbConnection,
    doQuery
}

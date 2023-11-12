const Attendance = {
    InsertAttendance:
    `insert into attendance_log set user_id = ?, attendance_type = ?, work_environment = ?,
    log_date_time = ?, latitude = ?, longitude = ?, distance = ?, status = ?, validity = ?;`,

    GetAttendanceLogByUserIdAndDate:
    `select user_id, attendance_type, work_environment, log_date_time, status, validity from attendance_log
    where user_id = ? and DATE(log_date_time) = ? and status = ?;`
}

module.exports = {
    Attendance
}

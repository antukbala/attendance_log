const Attendance = {
    InsertAttendanceOnAttendanceLogTable:
    `insert into attendance_log set user_id = ?, attendance_type = ?, work_environment = ?,
    log_date_time = ?, latitude = ?, longitude = ?, distance = ?, additional_details = ?;`,

    InsertAttendanceOnAttendanceStatusTable:
    `insert into attendance_log_status set attendance_id = ?, status = ?;`,

    GetAttendanceLogByUserIdAndDate:
    `select user_id, attendance_type, work_environment, log_date_time, status, validity from attendance_log
    where user_id = ? and DATE(log_date_time) = ? and status = ?;`
}

module.exports = {
    Attendance
}

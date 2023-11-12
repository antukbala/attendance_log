const Attendance = {
    insertAttendance:
    `insert into attendance_log set user_id = ?, attendance_type = ?, work_environment = ?,
    log_date_time = ?, latitude = ?, longitude = ?, distance = ?, status = ?, validity = ?;`
}

module.exports = {
    Attendance
}

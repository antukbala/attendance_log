const Attendance = {
    InsertAttendanceOnAttendanceLogTable:
    `insert into attendance_log set user_id = ?, attendance_type = ?, work_environment = ?,
    log_date_time = ?, latitude = ?, longitude = ?, distance = ?, additional_details = ?;`,

    InsertAttendanceOnAttendanceStatusTable:
    `insert into attendance_log_status set attendance_id = ?, attendance_status = ?, comment = ?;`,

    GetAttendanceLogByUserIdAndDate:
    `select user_id, attendance_type, work_environment, log_date_time, status, validity from attendance_log
    where user_id = ? and DATE(log_date_time) = ? and status = ?;`,

    GetAttendanceSetupOfOffice:
    `select ud.office_id, ud.category_id, uc.office_details_id, od.latitude, od.longitude,
    od.allowed_distance, od.check_in_time, od.check_out_time, od.time_flexibility
    from user_details ud inner join user_category uc on (ud.category_id = uc.category_id)
    inner join office_details od on (uc.office_details_id = od.office_details_id)
    inner join office_list ol on (ol.office_id = od.office_id)
    where ud.user_id = ? and ud.status = ? and uc.status = ? and od.status = ? and ol.status = ?;`
}

module.exports = {
    Attendance
}

const Attendance = {
    InsertAttendanceOnAttendanceLogTable:
    `insert into attendance_log set user_id = ?, attendance_type = ?, work_environment = ?,
    log_date_time = ?, latitude = ?, longitude = ?, distance = ?, additional_details = ?;`,

    InsertAttendanceOnAttendanceStatusTable:
    `insert into attendance_log_status set attendance_id = ?, attendance_status = ?, comment = ?;`,

    GetAttendanceLogByUserIdAndDate:
    `select user_id, attendance_id, attendance_type, work_environment, log_date_time, status, latitude,
    longitude, platform, additional_details, created_on, updated_on from attendance_log where user_id = ?
    and DATE(log_date_time) >= ? and DATE(log_date_time) <= ? and status in (?) and attendance_type in (?);`,

    GetAttendanceSetupOfOffice:
    `select ud.office_id, ud.category_id, uc.office_details_id, od.latitude, od.longitude,
    od.allowed_distance, od.check_in_time, od.check_out_time, od.time_flexibility
    from user_details ud inner join user_category uc on (ud.category_id = uc.category_id)
    inner join office_details od on (uc.office_details_id = od.office_details_id)
    inner join office_list ol on (ol.office_id = od.office_id)
    where ud.user_id = ? and ud.status = ? and uc.status = ? and od.status = ? and ol.status = ?;`
};

const Login = {
    GetUserDataForLogin:
    `select ud.user_id, ud.office_id, ud.name, ud.email, ud.mobile, ud.category_id,
    ud.photo_url, ud.login_id, ud.login_provider, ol.office_name, uc.department, uc.title
    from user_details ud inner join office_list ol on ud.office_id = ol.office_id
    inner join user_category uc on ud.category_id = uc.category_id
    where ud.email = ? and ud.status = ? and ol.status = ? and uc.status = ?;`
};

module.exports = {
    Attendance,
    Login
}

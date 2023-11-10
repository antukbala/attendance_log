function insertAttendanceLog(req, res) {
    try {
        const values = { user_id, latitude, longitude, log_date, log_time, time_type, work_type } = req.body;
        values.test = "data";
        return res.send(values);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    insertAttendanceLog
}

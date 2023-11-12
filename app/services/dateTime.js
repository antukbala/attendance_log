function getCurrentDateTime() {
    try {
        let currentDateTime = new Date();
        currentDateTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Dhaka',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(currentDateTime);

        let [currentDate, currentTime] = currentDateTime.split(', ');
        const [month, date, year] = currentDate.split('/');
        currentDate = `${year}-${month}-${date}`;
        return { date: currentDate, time: currentTime };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    getCurrentDateTime
}

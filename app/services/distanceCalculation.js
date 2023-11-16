function calculateDistanceByHaversineFormula(targetLatitude, targetLongitude, userLatitude, userLongitude, unit='km') {
    try {
	    const RADIUS_OF_EARTH = 6371;
        const DEGREE_TO_RADIAN = Math.PI / 180;
	    const latitudeDifference = (targetLatitude - userLatitude) * DEGREE_TO_RADIAN;
	    const longitudeDifference = (targetLongitude - userLongitude) * DEGREE_TO_RADIAN;
        const haversonLatitudeAngle = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2);
        const haversonLongitudeAngle = Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);
        const targetLatitudeInRadian = targetLatitude * (DEGREE_TO_RADIAN);
        const userLatitudeInRadian = userLatitude * (DEGREE_TO_RADIAN);
	
	    const a = haversonLatitudeAngle + Math.cos(targetLatitudeInRadian) * Math.cos(userLatitudeInRadian) * haversonLongitudeAngle;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    const distance = (unit === 'm') ? RADIUS_OF_EARTH * c * 1000 : RADIUS_OF_EARTH * c;
	
	    return distance;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    calculateDistanceByHaversineFormula
}
  
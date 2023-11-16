function generateResponse(statusCode, message, additionalFields = null, additionalValues = null) {
    try {
	    let output = {
            response_code: statusCode,
            message: message
        };

        if (additionalFields !== null && additionalValues !== null) {
            for (let i = 0; i < additionalFields.length; i++) {
                output[`${additionalFields[i]}`] = additionalValues[i];
            }
        }
	
	    return output;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    generateResponse
}
  
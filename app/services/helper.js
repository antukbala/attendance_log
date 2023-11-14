function generateResponse(statusCode, message, additionalField = null, additionalValue = null) {
    try {
	    let output = {
            response_code: statusCode,
            message: message
        };

        if (additionalField !== null && additionalValue !== null) {
            output[`${additionalField}`] = additionalValue;
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
  
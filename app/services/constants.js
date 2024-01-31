exports.CONSTANTS = {
    FINAL_RESPONSE: {
        MAKE_CUSTOM_RESPONSE: (keys, values) => {
            let response = {};
            for (let i = 0; i < keys.length; i++) {
                response[keys[i]] = values[i]
            }
            return response;
        }
    },
    MAX_VALID_DISTANCE: 100,
    NEGETIVE_VALUE: -1,
    NA: 'n/a',

    LOG_TYPE: {
        AUTO: 'auto'
    },

    ATTENDANCE_TYPE: {
        IN: 'in',
        OUT: 'out'
    },

    ATTENDANCE_STATUS: {
        PENDING: 'pending',
        APPROVED: 'approved',
        REJECTED: 'rejected',
        CONSIDERATION: 'consideration'
    },

    COMMENT_ON_ATTENDANCE_STATUS: {
        AUTO_APPROVED: 'auto approved',
        DISTANCE_ISSUE: 'distance more than allowed limit',
        TIME_ISSUE: 'time more than allowed limit',
        DISTANCE_OR_TIME_ISSUE: 'distance or time more than allowed limit',
    },

    STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive'
    },

    VALIDITY: {
        VALID: 'valid',
        INVALID: 'invalid'
    },

    RESPONSE_CODE: {
        SUCCESS: 1000,
        FAIL: 2000,
        FAILED_CASES: 2001
    },

    MESSAGE: {
        SAVED_ATTENDANCE: `attendance saved`,
        CANT_SAVE_ATTENDANCE: `can't save attendance`
    }
};

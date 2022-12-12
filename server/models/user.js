// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    unmatched_assignment_ids: {
        type: [String], 
        default: []
    },
    matched_assignment_ids: {
        type: [String], 
        default: []
    },
    sent_request_ids: {
        type: [String],
        default: []
    },
    recevied_request_ids: {
        type: [String],
        default: []
    },
    joined_team_ids: {
        type: [String],
        default: []
    }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);

// Load required packages
var mongoose = require('mongoose');

// Define our project schema
var IndividualAssignmentInfoSchema = new mongoose.Schema({
    assignment_id: String,
    user_id: String,
    description: String,
    matched: Boolean,
    team_id: String,
    skills_list: {type: [String], default: []}
});

// Export the Mongoose model
module.exports = mongoose.model('IndividualAssignmentInfo', IndividualAssignmentInfoSchema);
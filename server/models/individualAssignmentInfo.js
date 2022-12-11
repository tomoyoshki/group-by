// Load required packages
var mongoose = require('mongoose');

// Define our project schema
var IndividualAssignmentInfoSchema = new mongoose.Schema({
    assignment_id: String,
    user_id: String,
    description: String,
    matched: Boolean
});

// Export the Mongoose model
module.exports = mongoose.model('IndividualAssignmentInfo', IndividualAssignmentInfoSchema);
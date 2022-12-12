// Load required packages
var mongoose = require('mongoose');

// Define our assignment schema
var AssignmentSchema = new mongoose.Schema({
    start_date: Date,
    end_date: Date,
    join_code: String,
    assignment_name: String,
    team_ids: {type: [String], default: []},
    user_ids: {type: [String], default: []}
});

// Export the Mongoose model
module.exports = mongoose.model('Assignment', AssignmentSchema);
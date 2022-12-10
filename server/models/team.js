// Load required packages
var mongoose = require('mongoose');

// Define our team schema
var TeamSchema = new mongoose.Schema({
    team_id: String,
    assignment_id: String,
    user_ids: {type: [String], default: []}
});

// Export the Mongoose model
module.exports = mongoose.model('Team', TeamSchema);
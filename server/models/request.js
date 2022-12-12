// Load required packages
var mongoose = require('mongoose');

// Define our request schema
var RequestSchema = new mongoose.Schema({
    user_get_request: String,
    user_send_request: String,
    assignment_id: String,
    assignment_name: String
});

// Export the Mongoose model
module.exports = mongoose.model('Request', RequestSchema);
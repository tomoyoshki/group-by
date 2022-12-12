// Load required packages
var mongoose = require('mongoose');

// Define our request schema
var RequestSchema = new mongoose.Schema({
    request_id: String,
    user_get_request: String,
    user_send_request: String,
    assignment_id: String
});

// Export the Mongoose model
module.exports = mongoose.model('Request', RequestSchema);
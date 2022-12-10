// Load required packages
var mongoose = require('mongoose');

// Define our introduction schema
var IntroductionSchema = new mongoose.Schema({
    introduction_id: String,
    assignment_id: String,
    user_id: String,
    description: String
});

// Export the Mongoose model
module.exports = mongoose.model('Introduction', IntroductionSchema);
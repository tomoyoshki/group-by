/*
 * Connect all of your endpoints together here.
 */

module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/users', require('./users.js')(router));
    // app.use('/api/teams', require('./teams.js')(router));
    // app.use('/api/requests', require('./requests.js')(router));
    // app.use('/api/introductions', require('./introductions.js')(router));
    // app.use('/api/assignments', require('./assignments.js')(router));
};

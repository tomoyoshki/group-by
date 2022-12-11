const Team = require('../models/teams');
const querystring = require('querystring');
const url = require('url');

module.exports = function (router) {
    // endpoint: teams
    var teamsRoute = router.route('/teams');

    // get
    teamsRoute.get(async function (req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            console.log(parsed_queryString.where)
            let where = parsed_queryString.where ? JSON.parse(parsed_queryString.where) : {}
            let sort = parsed_queryString.sort ? JSON.parse(parsed_queryString.sort) : {}
            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select): {}
            let skip = parsed_queryString.skip ? parseInt(parsed_queryString.skip) : 0
            let limit = parsed_queryString.limit ? parseInt(parsed_queryString.limit) : 0
            let count = parsed_queryString.count ? parsed_queryString.count === "true" : false

            const teams = await Team.find(where, select).sort(sort).skip(skip).limit(limit).catch(err => {})
            if (count) {
                const teams_count = await Team.find(where, select).sort(sort).skip(skip).limit(limit).countDocuments().catch(err => {})
                if (teams == null || teams.length == 0) {
                    res.status(404)
                    var response = {
                        message: "GET: 404 not found",
                        data: {}
                    }
                    res.send(response)
                    return
                }
                var response = {
                    message: "GET: 200 count teams",
                    data: teams_count
                }
                res.status(200)
                res.send(response)
                return
            }

            // when teams not found
            if (teams == null || teams.length == 0) {
                res.status(404)
                var response = {
                    message: "GET: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }
            // when get success
            var response = {
                message: "GET: 200 success",
                data: teams
            }
            res.status(200)
            res.send(response)
            return
        } catch(err) {
            // catch server error
            res.status(500)
            console.log(err)
            var response = {
                message: "GET: 500 server error",
                data: {err}
            }
            res.send(response)
            return
        }
        });

        // post
        teamsRoute.post(async function(req, res) {
            
        try {
            // Teams cannot be created (or updated) without email, password, role
            if (req.body.password == null || req.body.password.length == 0 || req.body.email == null || req.body.email.length == 0 || req.body.role == null || req.body.role.length == 0) {
                res.status(404)
                var response = {
                    message: "POST: 404 unvalid user, a valid user should have email, password and role", 
                    data: {}
                }
                res.send(response)
                return
            }

            // Multiple users with the same email cannot exist
            const find_email_by_user = await User.find({email: req.params.email}).catch(err => {})
            if (find_email_by_user != null && find_email_by_user.length > 0) {
                res.status(404)
                var response = {
                    message: "Post: 404 can't create multiple users with the same email",
                    data: {}
                }
                res.send(response)
                return
            }

            const users = new User({
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                unmatched_assignment_ids: req.body.unmatched_assignment_ids ? req.body.unmatched_assignment_ids : [],
                matched_assignment_ids: req.body.matched_assignment_ids ? req.body.matched_assignment_ids : [],
                sent_request_ids: req.body.sent_request_ids ? req.body.sent_request_ids : [],
                recevied_request_ids: req.body.recevied_request_ids ? req.body.recevied_request_ids : [],
                joined_team_ids: req.body.joined_team_ids ? req.body.joined_team_ids : []
            })

            if (users == null || users.length == 0) {
                res.status(404)
                var response = {
                    message: "404: POST creat user unsuccessfully",
                    data: {}
                }
                res.send(response)
                return
            }

            await users.save()
            var response = {
                message: "POST: 201 created",
                data: users
            }
            res.status(201)
            res.send(response)
            return
        } catch(err) {
            // catch server error
            res.status(500)
            var response = {
                message: "POST: 500 server error",
                data: {}
            }
            res.send(response)
            return
        }
    });
}
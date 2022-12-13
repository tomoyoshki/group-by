const Team = require('../models/team');
const User = require('../models/user');
const Assignment = require('../models/assignment');
const individualAssignmentInfo = require('../models/individualAssignmentInfo')
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
                res.status(200)
                var response = {
                    message: "no team found",
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
            // Teams cannot be created (or updated) without assignment_id
            if (req.body.assignment_id == null || req.body.assignment_id.length == 0) {
                res.status(404)
                var response = {
                    message: "POST: 404 unvalid team, a valid team should have assignment_id", 
                    data: {}
                }
                res.send(response)
                return
            }


            const teams = new Team({
                assignment_id: req.body.assignment_id,
                user_ids: req.body.user_ids
            })

            if (teams == null || teams.length == 0) {
                res.status(404)
                var response = {
                    message: "404: POST creat team unsuccessfully",
                    data: {}
                }
                res.send(response)
                return
            }

            // update related tables
            teams.user_ids.forEach(async cur_user_id => {
                // update related user info
                let cur_user = await User.findOne({_id: cur_user_id}, {}).catch(err => {})
                // delete from unmatched_assignment_ids
                if (cur_user.unmatched_assignment_ids.includes(teams.assignment_id)) {
                    let cur_id_index = cur_user.unmatched_assignment_ids.indexOf(teams.assignment_id)
                    cur_user.unmatched_assignment_ids.splice(cur_id_index, 1)
                }
                // add to matched_assignment_ids
                if (!cur_user.matched_assignment_ids.includes(teams.assignment_id)) {
                    cur_user.matched_assignment_ids.push(teams.assignment_id)
                }
                await cur_user.save().catch(err => {})

                // update IndividualAssignmentInfo
                let cur_info = await individualAssignmentInfo.findOne({assignment_id: teams.assignment_id, user_id: cur_user_id}, {}).catch(err => {})
                cur_info.matched = true
                cur_info.team_id = teams._id
                await cur_info.save().catch(err => {})
            });

            await teams.save()
            var response = {
                message: "POST: 201 created",
                data: teams
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

    // Endpoints: teams/:id
    var cur_teamRoute = router.route('/teams/:id');
    // GET
    cur_teamRoute.get(async function(req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select) : {}

            const team = await Team.findOne({_id: req.params.id}, select).catch(err => {})
            // When team not found
            if (team == null || team.length == 0 ){
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
                data: team
            }
            res.status(200)
            res.send(response)
            return
        } catch(err) {
            // catch server error
            res.status(500)
            var response = {
                message: "GET: 500 server error",
                data: err
            }
            res.send(response)
            return
        }
    });

    // PUT
    cur_teamRoute.put(async function(req, res) {
        try {
            const team = await Team.findOne({_id: req.params.id}).catch(err => {})
            // When team not found
            if (team == null | team.length == 0) {
                res.status(404)
                var response = {
                    message: "PUT: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }
            // Teams cannot be created (or updated) without a assignment_id
            if (req.body.assignment_id == null || req.body.assignment_id == 0) {
                res.status(404)
                var response = {
                    message: "404: PUT can't updated without a name or a deadline",
                    data: {}
                }
                res.send(response)
                return
            }

            if (req.body.assignment_id) {
                team.assignment_id = req.body.assignment_id
            }
            if (req.body.user_ids) {
                team.user_ids = req.body.user_ids
            }

            // update related tables
            team.user_ids.forEach(async cur_user_id => {
                // update related user info
                let cur_user = await User.findOne({_id: cur_user_id}, {}).catch(err => {})
                // delete from unmatched_assignment_ids
                if (cur_user.unmatched_assignment_ids.includes(team.assignment_id)) {
                    let cur_id_index = cur_user.unmatched_assignment_ids.indexOf(team.assignment_id)
                    cur_user.unmatched_assignment_ids.splice(cur_id_index, 1)
                }
                // add to matched_assignment_ids
                if (!cur_user.matched_assignment_ids.includes(team.assignment_id)) {
                    cur_user.matched_assignment_ids.push(team.assignment_id)
                }
                await cur_user.save().catch(err => {})

                // update IndividualAssignmentInfo
                let cur_info = await individualAssignmentInfo.findOne({assignment_id: team.assignment_id, user_id: cur_user_id}, {}).catch(err => {})
                cur_info.matched = true
                cur_info.team_id = req.params.id
                await cur_info.save().catch(err => {})
            });

            await team.save().catch(err => { })
            // successfully put data
            res.status(200)
            var response = {
                message: "PUT: 200 server success",
                data: team
            }
            res.send(response)
            return
        } catch(err) {
            // catch server error
            console.log(err)
            res.status(500)
            var response = {
                message: "PUT: 500 server error",
                data: {}
            }
            res.send(response)
            return
        }
    })

   return router
}
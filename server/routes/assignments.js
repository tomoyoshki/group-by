const Team = require('../models/team');
const Assignment = require ('../models/assignment')
const individualAssignmentInfo = require('../models/individualAssignmentInfo')
const querystring = require('querystring');
const url = require('url');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = function (router) {
    // endpoint: assignments
    var assignmentsRoute = router.route('/assignments');

    // get
    assignmentsRoute.get(async function (req, res) {
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

            const assignments = await Assignment.find(where, select).sort(sort).skip(skip).limit(limit).catch(err => {})
            if (count) {
                const assignment_count = await Assignment.find(where, select).sort(sort).skip(skip).limit(limit).countDocuments().catch(err => {})
                if (assignments == null || assignments.length == 0) {
                    res.status(404)
                    var response = {
                        message: "GET: 404 not found",
                        data: {}
                    }
                    res.send(response)
                    return
                }
                var response = {
                    message: "GET: 200 count assignments",
                    data: assignment_count
                }
                res.status(200)
                res.send(response)
                return
            }

            // when assignments not found
            if (assignments == null || assignments.length == 0) {
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
                data: assignments
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
        assignmentsRoute.post(async function(req, res) {
            
        try {
            // Assignments cannot be created (or updated) without start_date and end_date
            if (req.body.start_date == null || req.body.start_date.length == 0 || req.body.end_date == null || req.body.end_date.length == 0) {
                res.status(404)
                var response = {
                    message: "POST: 404 unvalid assignments, a valid assignment should have start_date & end_date", 
                    data: {}
                }
                res.send(response)
                return
            }

            const assignments = new Assignment({
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                join_code: makeid(8),
                assignment_name: req.body.assignment_name,
                team_ids: req.body.team_ids ? req.body.team_ids : [],
                user_ids: req.body.user_ids ? req.body.user_ids: []
            })

            if (assignments == null || assignments.length == 0) {
                res.status(404)
                var response = {
                    message: "404: POST creat assignment unsuccessfully",
                    data: {}
                }
                res.send(response)
                return
            }

            await assignments.save()
            var response = {
                message: "POST: 201 created",
                data: assignments
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

    // Endpoints: assignments/join_code
    var code_assignment_route = router.route('/assignments/:join_code')
    // GET
    code_assignment_route.get(async function(req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select) : {}

            const assignment = await Assignment.findOne({join_code: req.params.join_code}, select).catch(err => {})
            // When assignment not found
            if (assignment == null || assignment.length == 0 ){
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
                data: assignment
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
    code_assignment_route.put(async function(req, res) {
        try {
            const assignment = await Assignment.findOne({join_code: req.params.join_code}).catch(err => {})
            // When assignment not found
            if (assignment == null | assignment.length == 0) {
                res.status(404)
                var response = {
                    message: "PUT: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }
            // Assignment cannot be created (or updated) without a join_code
            if (req.body.start_date == null || req.body.name.start_date == 0 || req.body.end_date == null || req.body.name.end_date == 0 || req.body.join_code == null || req.body.name.join_code == 0) {
                res.status(404)
                var response = {
                    message: "404: PUT can't updated without a start_date, end_date, and join_code",
                    data: {}
                }
                res.send(response)
                return
            }

            if (req.body.start_date) {
                assignment.start_date = req.body.start_date
            }
            if (req.body.end_date) {
                assignment.end_date = req.body.end_date
            }
            if (req.body.join_code) {
                assignment.join_code = req.body.join_code
            }
            if (req.body.assignment_name) {
                assignment.assignment_name = req.body.assignment_name
            }
            if (req.body.team_ids) {
                assignment.team_ids = req.body.team_ids
            }
            if (req.body.user_ids) {
                assignment.user_ids = req.body.user_ids
            }

            await assignment.save().catch(err => { })
            // successfully put data
            res.status(200)
            var response = {
                message: "PUT: 200 server success",
                data: assignment
            }
            res.send(response)
            return
        } catch(err) {
            // catch server error
            res.status(500)
            var response = {
                message: "PUT: 500 server error",
                data: {}
            }
            res.send(response)
            return
        }
    })

    // Endpoints: assignments/:id
    var cur_assignmentRoute = router.route('/assignments/:id');
    // GET
    cur_assignmentRoute.get(async function(req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select) : {}

            const assignment = await Assignment.findOne({_id: req.params.id}, select).catch(err => {})
            // When assignment not found
            if (assignment == null || assignment.length == 0 ){
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
                data: assignment
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
    cur_assignmentRoute.put(async function(req, res) {
        try {
            const assignment = await Assignment.findOne({_id: req.params.id}).catch(err => {})
            // When assignment not found
            if (assignment == null | assignment.length == 0) {
                res.status(404)
                var response = {
                    message: "PUT: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }
            // Assignment cannot be created (or updated) without a join_code
            if (req.body.start_date == null || req.body.name.start_date == 0 || req.body.end_date == null || req.body.name.end_date == 0 || req.body.join_code == null || req.body.name.join_code == 0) {
                res.status(404)
                var response = {
                    message: "404: PUT can't updated without a start_date, end_date, and join_code",
                    data: {}
                }
                res.send(response)
                return
            }

            if (req.body.start_date) {
                assignment.start_date = req.body.start_date
            }
            if (req.body.end_date) {
                assignment.end_date = req.body.end_date
            }
            if (req.body.join_code) {
                assignment.join_code = req.body.join_code
            }
            if (req.body.assignment_name) {
                assignment.assignment_name = req.body.assignment_name
            }
            if (req.body.team_ids) {
                assignment.team_ids = req.body.team_ids
            }
            if (req.body.user_ids) {
                assignment.user_ids = req.body.user_ids
            }

            await assignment.save().catch(err => { })
            // successfully put data
            res.status(200)
            var response = {
                message: "PUT: 200 server success",
                data: assignment
            }
            res.send(response)
            return
        } catch(err) {
            // catch server error
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
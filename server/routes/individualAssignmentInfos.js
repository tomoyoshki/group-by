const User = require('../models/user');
const Assignment = require ('../models/assignment')
const IndividualAssignmentInfo = require('../models/individualAssignmentInfo')
const querystring = require('querystring');
const url = require('url');


module.exports = function (router) {
    // endpoint: infos
    var infosRoute = router.route('/infos');

    // get
    infosRoute.get(async function (req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            let where = parsed_queryString.where ? JSON.parse(parsed_queryString.where) : {}
            let sort = parsed_queryString.sort ? JSON.parse(parsed_queryString.sort) : {}
            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select): {}
            let skip = parsed_queryString.skip ? parseInt(parsed_queryString.skip) : 0
            let limit = parsed_queryString.limit ? parseInt(parsed_queryString.limit) : 0
            let count = parsed_queryString.count ? parsed_queryString.count === "true" : false

            const infos = await IndividualAssignmentInfo.find(where, select).sort(sort).skip(skip).limit(limit).catch(err => {})
            
            // when infos not found
            if (infos == null || infos.length == 0) {
                res.status(404)
                var response = {
                    message: "GET: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }
            if (count) {
                const infos_count = await infos.length
                if (infos_count == null || infos_count.length == 0) {
                    res.status(200)
                    var response = {
                        message: "GET: info not found",
                        data: {}
                    }
                    res.send(response)
                    return
                }
                var response = {
                    message: "GET: 200 count infos",
                    data: infos_count
                }
                console.log("infos: ", infos)
                console.log("infos_count: ", infos_count)
                res.status(200)
                res.send(response)
                return
            }

            // when get success
            var response = {
                message: "GET: 200 success",
                data: infos
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
        infosRoute.post(async function(req, res) {

        try {
            // Infos cannot be created (or updated) without assignment_id and user_id
            console.log(req)
            if (req.body.assignment_id == null || req.body.assignment_id.length == 0 || req.body.user_id == null || req.body.user_id.length == 0) {
                res.status(404)
                var response = {
                    message: "POST: 404 unvalid info, a valid info should have assignment_id & user_id", 
                    data: {}
                }
                res.send(response)
                return
            }

            // Same user could not join the same assignment multiple times
            const find_user_assignment = await IndividualAssignmentInfo.find({assignment_id: req.body.assignment_id, user_id: req.body.user_id}).catch(err => {})
            if (find_user_assignment != null && find_user_assignment.length != 0) {
                res.status(404)
                var response = {
                    message: "Post: 404 the user has already joined that assignment",
                    data: {}
                }
                res.send(response)
                return
            }

            const infos = new IndividualAssignmentInfo({
                assignment_id: req.body.assignment_id,
                user_id: req.body.user_id,
                description: req.body.description,
                matched: req.body.matched ? req.body.matched : false,
                team_id: req.body.team_id ? req.body.team_id : "",
                skills_list: req.body.skills_list ? req.body.skills_list: []
            })

            if (infos == null || infos.length == 0) {
                res.status(404)
                var response = {
                    message: "404: POST creat infos unsuccessfully",
                    data: {}
                }
                res.send(response)
                return
            }

            // update
            let cur_user = await User.findOne({_id: infos.user_id}, {}).catch(err => {})
            if (!cur_user.unmatched_assignment_ids.includes(infos.assignment_id)) {
                cur_user.unmatched_assignment_ids.push(infos.assignment_id)
            }
            await cur_user.save().catch(err => {})

            let cur_assignment = await Assignment.findOne({_id: infos.assignment_id}, {}).catch(err => {})
            if (!cur_assignment.user_ids.includes(infos.user_id)) {
                cur_assignment.user_ids.push(infos.user_id)
            }
            await cur_assignment.save().catch(err => {})


            await infos.save()
            var response = {
                message: "POST: 201 created",
                data: infos
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

    // Endpoints: infos/:id
    var cur_infoRoute = router.route('/infos/:id');
    // GET
    cur_infoRoute.get(async function(req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select) : {}

            const info = await IndividualAssignmentInfo.findOne({_id: req.params.id}, select).catch(err => {})
            // When info not found
            if (info == null || info.length == 0 ){
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
                data: info
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
    cur_infoRoute.put(async function(req, res) {
        try {
            const info = await IndividualAssignmentInfo.findOne({_id: req.params.id}).catch(err => {})
            // When info not found
            if (info == null | info.length == 0) {
                res.status(404)
                var response = {
                    message: "PUT: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }
            // Info cannot be created (or updated) without a assignment_id & user_id
            if (req.body.assignment_id == null || req.body.assignment_id.length == 0 || req.body.user_id == null || req.body.user_id.length == 0) {
                res.status(404)
                var response = {
                    message: "404: PUT can't updated without an assignment_id, and user_id",
                    data: {}
                }
                res.send(response)
                return
            }

            if (req.body.assignment_id) {
                info.assignment_id = req.body.assignment_id
            }
            if (req.body.user_id) {
                info.user_id = req.body.user_id
            }
            if (req.body.description) {
                info.description = req.body.description
            }
            if (req.body.matched) {
                info.matched = req.body.matched ? req.body.matched : false
            }
            if (req.body.team_id) {
                info.team_id = req.body.team_id
            }
            if (req.body.skills_list) {
                info.skills_list = req.body.skills_list
            }

            // update
            let cur_user = await User.findOne({_id: info.user_id}, {}).catch(err => {})
            if (!cur_user.unmatched_assignment_ids.includes(info.user_id)) {
                cur_user.unmatched_assignment_ids.push(info.user_id)
            }
            await cur_user.save().catch(err => {})

            await info.save().catch(err => { })
            // successfully put data
            res.status(200)
            var response = {
                message: "PUT: 200 server success",
                data: info
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
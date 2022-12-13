const Request = require('../models/request');
const User = require('../models/user');
const Assignment = require('../models/assignment');
const querystring = require('querystring');
const url = require('url');


module.exports = function (router) {
    // endpoint: requests
    var requestsRoute = router.route('/requests');

    // get
    requestsRoute.get(async function (req, res) {
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

            const requests = await Request.find(where, select).sort(sort).skip(skip).limit(limit).catch(err => {})
            if (count) {
                const request_count = await Request.find(where, select).sort(sort).skip(skip).limit(limit).countDocuments().catch(err => {})
                if (requests == null || requests.length == 0) {
                    res.status(404)
                    var response = {
                        message: "GET: 404 not found",
                        data: {}
                    }
                    res.send(response)
                    return
                }
                var response = {
                    message: "GET: 200 count requests",
                    data: request_count
                }
                res.status(200)
                res.send(response)
                return
            }

            // when requests not found
            if (requests == null || requests.length == 0) {
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
                data: requests
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
        requestsRoute.post(async function(req, res) {
            
        // try {
            // Requests cannot be created (or updated) without user_get_request and user_send_request
            if (req.body.user_get_request == null || req.body.user_get_request.length == 0 || req.body.user_send_request == null || req.body.user_send_request.length == 0) {
                res.status(404)
                var response = {
                    message: "POST: 404 unvalid requests, a valid request should have user_get_request & user_send_request", 
                    data: {}
                }
                res.send(response)
                return
            }

            const cur_assignment = await Assignment.findOne({_id: req.body.assignment_id}).catch(err => {})

            const requests = new Request({
                user_get_request: req.body.user_get_request,
                user_send_request: req.body.user_send_request,
                assignment_id: req.body.assignment_id,
                assignment_name: cur_assignment.assignment_name
            })

            if (requests == null || requests.length == 0) {
                res.status(404)
                var response = {
                    message: "404: POST creat requests unsuccessfully",
                    data: {}
                }
                res.send(response)
                return
            }

            let cur_get_user = await User.findOne({_id: requests.user_get_request}, {}).catch(err => {})
            if (!cur_get_user.recevied_request_ids.includes(requests._id)) {
                cur_get_user.recevied_request_ids.push(requests._id)
            }
            await cur_get_user.save().catch(err => {})

            let cur_send_user = await User.findOne({_id: requests.user_send_request}, {}).catch(err => {})
            if (!cur_send_user.sent_request_ids.includes(requests._id)) {
                cur_send_user.sent_request_ids.push(requests._id)
            }
            await cur_send_user.save().catch(err => {})

            await requests.save()
            var response = {
                message: "POST: 201 created",
                data: requests
            }
            res.status(201)
            res.send(response)
            return
        // } catch(err) {
        //     // catch server error
        //     res.status(500)
        //     var response = {
        //         message: "POST: 500 server error",
        //         data: {}
        //     }
        //     res.send(response)
        //     return
        // }
    });

    // Endpoints: requests/:id
    var cur_requestRoute = router.route('/requests/:id');
    // GET
    cur_requestRoute.get(async function(req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select) : {}

            const request = await Request.findOne({_id: req.params.id}, select).catch(err => {})
            // When request not found
            if (request == null || request.length == 0 ){
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
                data: request
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
    cur_requestRoute.put(async function(req, res) {
        try {
            const request = await Request.findOne({_id: req.params.id}).catch(err => {})
            // When request not found
            if (request == null | request.length == 0) {
                res.status(404)
                var response = {
                    message: "PUT: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }
            // Request cannot be created (or updated) without a join_code
            if (req.body.user_get_request == null || req.body.user_get_request.length == 0 || req.body.user_send_request == null || req.body.user_send_request.length == 0) {
                res.status(404)
                var response = {
                    message: "404: PUT can't updated without a start_date, end_date, and join_code",
                    data: {}
                }
                res.send(response)
                return
            }

            if (req.body.user_get_request) {
                request.user_get_request = req.body.user_get_request
            }
            if (req.body.user_send_request) {
                request.user_send_request = req.body.user_send_request
            }
            if (req.body.assignment_id) {
                request.assignment_id = req.body.assignment_id
            }

            // update
            let cur_get_user = await User.findOne({id: request.user_get_request}, {}).catch(err => {})
            if (!cur_get_user.recevied_request_ids.includes(request.user_get_request)) {
                cur_get_user.recevied_request_ids.push(request.user_get_request)
            }
            await cur_get_user.save().catch(err => {})

            let cur_send_user = await User.findOne({id: request.user_send_request}, {}).catch(err => {})
            if (!cur_send_user.sent_request_ids.includes(request.user_send_request)) {
                cur_send_user.sent_request_ids.push(request.user_send_request)
            }
            await cur_send_user.save().catch(err => {})

            await request.save().catch(err => { })
            // successfully put data
            res.status(200)
            var response = {
                message: "PUT: 200 server success",
                data: request
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
    // DELETE
    cur_requestRoute.delete(async function(req, res) {
        try {
            console.log(req.params.id)
            const request = await Request.findOne({_id: req.params.id}).catch(err => {})
            if (request == null || request.length === 0) {
                console.log("Did not find")
                res.status(404)
                var response = {
                    message: "DELETE: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }

            // update request
            console.log(request)
            let cur_get_user = await User.findOne({_id: request.user_get_request}, {}).catch(err => {})
            if (cur_get_user.recevied_request_ids.includes(request.user_get_request)) {
                let cur_id_index = cur_get_user.recevied_request_ids.indexOf(request.user_get_request)
                cur_get_user.recevied_request_ids.splice(cur_id_index, 1)
            }
            await cur_get_user.save().catch(err => {})

            let cur_send_user = await User.findOne({_id: request.user_send_request}, {}).catch(err => {})
            if (cur_send_user.sent_request_ids.includes(request.user_send_request)) {
                let cur_id_index = cur_send_user.sent_request_ids.indexOf(request.user_send_request)
                cur_send_user.sent_request_ids.splice(cur_id_index, 1)
            }
            await cur_send_user.save().catch(err => {})

            const result = await Request.deleteOne({_id: req.params.id}).catch(err => {})
            // when request not found
            if (result == null | result.length == 0) {
                res.status(404)
                var response = {
                    message: "DELETE: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }
            // successfully delete
            var response = {
                message: "DELETE: 204 no content, successful",
                data: {}
            }
            res.status(204)
            res.send(response)
            return
        } catch (e){
            // catch server error
            console.log(e)
            res.status(500)
            var response = {
                message: "DELETE: 500 server error",
                data: {}
            }
            res.send(response)
            return
        }
    })
    return router
    
}
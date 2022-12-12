const User = require('../models/user');
const querystring = require('querystring');
const url = require('url');
const IndividualAssignmentInfo = require('../models/individualAssignmentInfo');
const Team = require('../models/team');
const Request = require('../models/request');
// const Crypto = require('crypto')

// function randomString(size = 12) {  
//     return Crypto
//       .randomBytes(size)
//       .toString('hex')
//       .slice(0, size)
//   }

module.exports = function (router) {
    
    // Endpoint: users
    var usersRoute = router.route('/users');
    // GET
    usersRoute.get(async function (req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            console.log("user get(): parsed query string: ", parsed_queryString.where)
            let where = parsed_queryString.where ? JSON.parse(parsed_queryString.where) : {}
            let sort = parsed_queryString.sort ? JSON.parse(parsed_queryString.sort) : {}
            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select): {}
            let skip = parsed_queryString.skip ? parseInt(parsed_queryString.skip) : 0
            let limit = parsed_queryString.limit ? parseInt(parsed_queryString.limit) : 0
            let count = parsed_queryString.count ? parsed_queryString.count === "true" : false

            const users = await User.find(where, select).sort(sort).skip(skip).limit(limit).catch(err => {})

            if (count) {
                const users_count = await User.find(where, select).sort(sort).skip(skip).limit(limit).countDocuments().catch(err => {})
                if (users == null || users.length == 0) {
                    res.status(404)
                    var response = {
                        message: "GET: 404 not found",
                        data: {}
                    }
                    res.send(response)
                    return
                }
                var response = {
                    message: "GET: 200 count users",
                    data: users_count
                }
                res.status(200)
                res.send(response)
                return
            }
            
            // when users not found
            if (users == null || users.length == 0) {
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
                data: users
            }
            res.status(200)
            res.send(response)
            return
        } catch(err) {
            // catch server error
            res.status(500)
            // console.log(err)
            var response = {
                message: "GET: 500 server error",
                data: {err}
            }
            res.send(response)
            return
        }
    });
    // POST
    usersRoute.post(async function(req, res) {
        // try {
            // Users cannot be created (or updated) without email, password, role
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
            const find_email_by_user = await User.find({email: req.body.email}).catch(err => {})
            if (find_email_by_user != null) {
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

    // // Endpoints: users/:id
    // var cur_userRoute = router.route('/users/:id');
    // // GET
    // cur_userRoute.get(async function(req, res) {
    //     try {
    //         let parsed_url = url.parse(req.url)
    //         let parsed_queryString = querystring.parse(parsed_url.query)

    //         let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select) : {}

    //         const user = await User.findOne({_id: req.params.id}, select).catch(err => {})
    //         // when user not found
    //         if (user == null || user.length == 0) {
    //             res.status(404)
    //             var response = {
    //                 message: "GET: 404 not found user with provided id",
    //                 data: {}
    //             }
    //             res.send(response)
    //             return
    //         }
    //         // When get success
    //         var response = {
    //             message: "GET: 200 success",
    //             data: user
    //         }
    //         res.status(200)
    //         res.send(response)
    //         return
    //     } catch(err) {
    //         // catch server error
    //         res.status(500)
    //         var response = {
    //             message: "GET: 500 server error",
    //             data: err
    //         }
    //         res.send(response)
    //         return
    //     }
    // });

    // Endpoints: users/:email
    var cur_userRoute = router.route('/users/:email');
    // GET
    cur_userRoute.get(async function(req, res) {
        try {
            let parsed_url = url.parse(req.url)
            let parsed_queryString = querystring.parse(parsed_url.query)

            let select = parsed_queryString.select ? JSON.parse(parsed_queryString.select) : {}

            const user = await User.findOne({email: req.params.email}, select).catch(err => {})
            // when user not found
            if (user == null || user.length == 0) {
                res.status(404)
                var response = {
                    message: "GET: 404 not found user with provided email",
                    data: {}
                }
                res.send(response)
                return
            }
            // When get success
            var response = {
                message: "GET: 200 success",
                data: user
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
    cur_userRoute.put(async function(req, res) {
        try {
            // check whether put with email
            if (req.body.email == null || req.body.email.length == 0) {
                res.status(404)
                var response = {
                    message: "PUT: 404 can't put without email",
                    data: {}
                }
                res.send(response)
                return
            }

            const user = await User.findOne({email: req.params.email}).catch(err => {})
            // When user not found
            if (user == null || user.length == 0) {
                res.status(404)
                var response = {
                    message: "PUT: 404 not found",
                    data: {}
                }
                res.send(response)
                return
            }

            // Multiple users with the same email cannot exist
            const find_email_by_user = await User.find({email: req.params.email}).catch(err => {})
            if (find_email_by_user != null && find_email_by_user.length > 0 && String(user.id) != String(find_email_by_user[0].id)) {
                res.status(404)
                var response = {
                    message: "PUT: 404 can't create multiple users with the same email",
                    data: {}
                }
                res.send(response)
                return
            }

            if (req.body.email) {
                user.email = req.body.email
            }

            if (req.body.password) {
                user.password = req.body.password
            }

            if (req.body.role) {
                user.role = req.body.role
            }

            await user.save()
            // successfully put data
            res.status(200)
            var response = {
                message: "PUT: 200 server success",
                data: user
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
    });
    // DELETE
    // cur_userRoute.delete(async function(req, res) {
    //     try {
    //         const user = await User.findOne({email: req.params.email}, {}).catch(err => {})
    //         // when user not found
    //         if (user == null || user.length == 0) {
    //             res.status(404)
    //             var response = {
    //                 message: "DELET: 404 not found",
    //                 data: {}
    //             }
    //             res.send(response)
    //             return
    //         }
            
    //         // update the teams with cur user
    //         const teams_by_cur_user = await Team.find({"_id": {"$in": user.joined_team_ids}}).catch(err => {})
    //         if (teams_by_cur_user != null && teams_by_cur_user.length != 0) {
    //             teams_by_cur_user.forEach(async cur_team => {
    //                 const index_cur_user = cur_team.user_ids.indexOf(user._id)
    //                 cur_team.user_ids = cur_team.user_ids.splice(index_cur_user, 1)
    //                 await cur_team.save().catch(err => {})
    //             });
    //         }

    //         // delet the received request record
    //         const requests_received_by_cur_user = await Request.find({"_id": {"$in": user.recevied_request_ids}}).catch(err => {})
    //         if (requests_received_by_cur_user != null && requests_received_by_cur_user.length != 0) {
    //             requests_received_by_cur_user.forEach(async cur_request => {
    //                 const request_from_user = await User.findOne({_id: cur_request.user_send_request}).catch(err => {})
    //             })
    //         }
            



    //         // successfully delete
    //         const result = await User.deleteOne({_id: req.params.id}).catch(err => {})
    //         var response = {
    //             message: "DELETE: 204 no content, successful",
    //             data: {}
    //         }
    //         res.status(204)
    //         res.send(response)
    //         return
    //     } catch(err) {
    //         // catch server error
    //         res.status(500)
    //         var response = {
    //             message: "DELET: 500 server error",
    //             data: {}
    //         }
    //         res.send(response)
    //         return
    //     }
    // })

    return router;
}

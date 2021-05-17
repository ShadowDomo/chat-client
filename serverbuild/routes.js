"use strict";
/* Handles routing for proj*/
exports.__esModule = true;
var controller_1 = require("./controller");
var express = require("express");
var router = express.Router();
// Routes
// communities routes
router.post('/newMessage', controller_1["default"].newMessage);
router.get('/', function (req, res) {
    res.send('gg');
});
// router.post('/addCommunity', controller.addCommunity);
// router.post('/updateCommunity', communityController.updateCommunity);
// router.post('/newThread', communityController.makeThread);
// router.get('/getCommunities', communityController.getCommunities);
// router.get('/getCommunity/:name', communityController.getCommunity);
exports["default"] = router;

// DEPENDENCIES
// ============
var express = require("express");
var http = require("http");
var port = (process.env.PORT || 8001);
var server = module.exports = express();
var bundle = require('browserify')();
var fs = require('fs');
var request = require('request');
var uglify = require('uglify-js');


// VIDEO CHAT BUNDLING
// ====================
bundle.add('./public/js/libs/plugins/video-chat/simplewebrtc');
// bundle.bundle({standalone: 'SimpleWebRTC'}, function (err, source) {
//     if (err) console.error(err);
//     fs.writeFileSync('public/js/libs/plugins/video-chat/simplewebrtc.bundle.js', source);
//     request.get('http://signaling.simplewebrtc.com:8888/socket.io/socket.io.js', function (err, res, body) {
//         if (!err && body && body.length) {
//             fs.writeFile('public/js/libs/plugins/webrtc.js', uglify.minify(source + body, {fromString: true}).code, function (err) {
//                 if (err) throw err;
//             });
//         }
//     });
// });

// SERVER CONFIGURATION
// ====================
server.configure(function () {

    server.use(express["static"](__dirname + "/../public"));

    server.use(express.errorHandler({

        dumpExceptions:true,

        showStack:true

    }));

    server.use(express.bodyParser());

    server.use(server.router);
});

// SERVER
// ======

// Start Node.js Server
http.createServer(server).listen(port);
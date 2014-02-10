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
var knox = require('knox');
var s3 = knox.createClient({ key: 'AKIAJJS4Z3EJD2BT77NA', secret: '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', bucket: 'mockitbrd'});
var responsePackage = {
    success: null,
    data: {}
};


// VIDEO CHAT BUNDLING
// ====================
bundle.add('./public/js/libs/plugins/video-chat/simplewebrtc');
// bundle.bundle({standalone: 'SimpleWebRTC'}, function (err, source) {
//     if (err) console.error(err);
//     fs.writeFileSync('public/js/libs/plugins/video-chat/simplewebrtc.bundle.js', source);
//     request.get('http://signaling.simplewebrtc.com:8888/socket.io/socket.io.js', function (err, res, body) {
//         if (!err && body && body.length) {
//             fs.writeFile('public/js/libs/plugins/video-chat/webrtc.js', uglify.minify(source + body, {fromString: true}).code, function (err) {
//                 if (err) throw err;
            // });
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

//get user profile picture
server.get('/getUserpic/:id', function (request, response) {
	var user_id = request.params.id;
	var userFilePath = '/users/' + user_id + '/user_pic.jpg';
    s3.getFile(userFilePath, function(err, imageStream) {
    	var statusCode = imageStream.statusCode;
    	if (statusCode !== 200) {
    		s3.getFile('/users/default/user_pic.jpg', function(error, defaultImage) {
                if (error) {
                    defaultImage.pipe(error);
                } else {
                    defaultImage.pipe(response);
                }
    		});
    	} else {
    		imageStream.pipe(response);
    	}
    });
});
server.put('/uploadUserpic', function (request, response) {
    console.log(request, response);
    fs.readFile(request.files.image.path, function(err, buf){ // read file submitted from the form on the fly
        var user_id = request.body.user_id;
        var filePath = 'users/' + user_id + '/user_pic.jpg';
        var s3req = s3.put(filePath, { // configure putting a file. Write an algorithm to name your file
            'Content-Length': buf.length,
            'Content-Type': 'image/jpeg'
        });
        s3req.on('response', function(s3res){ // write code for response
            s3res.on('end', function() {
                response.end()
            });
        });
        if (200 === response.statusCode) {
            responsePackage.success = 1;
            responsePackage.data = {};
            responsePackage.data.image = request.files.image;
        }
        response.send(responsePackage);
        s3req.end(buf); // execute uploading
    });
});

// Start Node.js Server
http.createServer(server).listen(port);

'use strict';
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");


var route = function(pathname) {

    var path = __dirname,
        corrected = false,
        pathSplit;
    if (pathname === "" || pathname === "index" || pathname === "home"
        || pathname === "index.html") {
        path += "/index.html";
        corrected = true;

    } else {
        path +='/' + pathname;
    }

    pathSplit = pathname.split(".");

    if (pathSplit.length === 1 && corrected === false) {
        path += ".html";

    }
    return path;

};

var serve = function(path) {

    var html = "";

    try {
        html = fs.readFileSync(path);
    } catch (err) {
        console.log("Reading file was unsuccesful.");
        html = "ERROR";
    }

    return html;
};

var reqtype = function(path) {

    var type = "",
        pathSplit = path.split(".");
    if (pathSplit === 1) {
        type = "plain";
    } else {

        type = pathSplit[1];
    }

    return type;
};

var onRequest = function(request, response) {

    var pathname = url.parse(request.url).pathname,
        path,
        res = "",
        type;
    try {
        pathname = pathname.substring(1, pathname.length);
    } catch (err) {
        console.error("Path not found");
    }

    if (pathname !== "favicon.ico") {
        if(pathname === 'login/authenticate.do') {
            type = 'application/json';
            response.write(JSON.stringify({success:true}));
        } else {
            path = route(pathname);
            res = serve(path);
            type = "text/" + reqtype(path);
        }
        response.writeHead(200, {
            "Content-Type" : type
        });
        response.write(res);
        response.end();
    }
};

http.createServer(onRequest).listen(8080);
console.log("Server has been started");
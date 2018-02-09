var fs = require('fs');
var http = require('http');
var url = require('url');
var express = require('express');
var cors =  require('cors')();
var app = express();
var PythonShell = require('python-shell');
const ROOT_DIR = "html/";
const ip = "13.124.195.114";
const port = "3000";
const PATH = "/gw/v1";

app.use(cors);
/*app.use(function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
          next();
    });*/

app.all('*', function (req, res, next) {
  var urlObj = url.parse(req.url, true, false);
	var dir = urlObj.pathname.split("/");
	if(dir[1] == "sl2"){
		fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
			if (err) {
				console.log(err);
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
	  });
	}
	else if(urlObj.pathname == "/command-analysis/"){
    body = "";
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    req.on('data',function(data){
      body += data;
    });
    req.on('end',function(){
			var options = {
				args: [body]
			};
			PythonShell.run('./html/sl2/command-analysis.py', options, function (err, results) {
				if (err) throw err;
				var lang = new Array;
				for(var i=1; i<results.length; i++){
					var word = results[i].split("(");
					word = word[1].split(")");
					word = word[0].split(" ");
					lang.push(word);
				}
				comprehend(lang,res);
			});
    });
	}
	else{
		body = "";
		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
		req.on('data',function(data){
			body += data;
		});
		req.on('end',function(){
			var method = req.method;
			var json = null;
			if(method != 'GET')
				json = JSON.parse(body.toString());
			gwRequest(urlObj.pathname,method,json,returnResponse,res);
		})
	}
});
function returnResponse(res,response){
  var serverData = '';
  response.on('data',function(chunk){
    serverData += chunk;
  });
  response.on('end',function(){
		var d = JSON.parse(serverData);
    res.end(serverData);
  });
}

app.listen(20398, function () {
  console.log('CORS-enabled web server listening on port 20398');
});

var gwRequest= function(path,m,body,callback,res){
  var options = {
    host: ip,
    port: port,
    path: PATH + path,
    method: m,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if(m == 'GET'){
    http.request(options,function(response){
      returnResponse(res,response);
    }).end();
  }
  else{
    var bodyString = JSON.stringify(body);
    options["headers"] = {
      'Content-Type': 'application/json',
			'Content-Length': bodyString.length
    };
    http.request(options,function(response){
			returnResponse(res,response);
    }).write(bodyString);
  }
};
function comprehend(lang,res){
	var action = null;
	var device = "light";
	var num = null;
	for(var i=0; i<lang.length; i++){
		words = lang[i];
		console.log(words);
		if(words[0]=="NP"){
			var n = words.indexOf("번/Noun");
			if(n>0){
				var num = words[n-1].split("/");
				num = num[0];
				console.log(device + num);
			}
		}
		else if(words[0]=="AP"){
			
		}
		else if(words[0]=='VP'){
			var on = "켜"+"/Verb";
			var n = words.indexOf(on);
			if(n>0)
				action = "TurnOn";
		}
	}
	var json = {
			action: action,
			device: device,
			num: num
		};
	res.end(JSON.stringify(json));
}
